// app/api/components/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { PromptRole, TargetTech } from "@/generated/prisma/client";
import { getUserEntitlement } from "@/lib/billing/entitlements";
import { getGenerationUsage } from "@/lib/billing/generation-usage";

export async function POST(request) {
  // 1. Check session
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Pull payload
  const {
    messages = [],
    name,
    html,
    css,
    js,
    jsx,
    targetTech,
    usageMetadata,
    model,
    effort,
  } = await request.json();

  let component;
  // 3. Create component tied to the authenticated user
  try {
    // If component was manually coded (no prompts)
    if (messages.length < 2) {
      component = await prisma.component.create({
        data: {
          name: name.trim() || "New Project",
          html: html.trim() || "",
          css: css.trim() || "",
          js: js.trim() || "",
          jsx: jsx.trim() || "",
          targetTech:
            targetTech === "HTML" ? TargetTech.HTML : TargetTech.REACT,
          user: {
            connect: { id: session.user.id },
          },
        },
        include: {
          prompts: {
            orderBy: {
              id: "asc",
            },
          },
        },
      });
    } else {
      // If component was AI-generated (user prompt + model response)
      component = await prisma.component.create({
        data: {
          name: name.trim() || "New Project",
          html: html.trim() || "",
          css: css.trim() || "",
          js: js.trim() || "",
          jsx: jsx.trim() || "",
          targetTech:
            targetTech === "HTML" ? TargetTech.HTML : TargetTech.REACT,
          user: {
            connect: { id: session.user.id },
          },
          prompts: {
            create: [
              {
                message: messages[messages.length - 2]?.message,
                role: PromptRole.USER,

                aiRequest: usageMetadata
                  ? {
                      create: {
                        model,
                        effort,
                        targetTech:
                          targetTech === "HTML"
                            ? TargetTech.HTML
                            : TargetTech.REACT,
                        inputTokens: usageMetadata.inputTokens ?? 0,
                        outputTokens: usageMetadata.outputTokens ?? 0,
                        thinkingTokens: usageMetadata.reasoningTokens ?? 0,
                        totalTokens: usageMetadata.totalTokens ?? 0,
                      },
                    }
                  : undefined,
              },
              {
                message: messages[messages.length - 1]?.message,
                role: PromptRole.ASSISTANT,
              },
            ],
          },
        },
        include: {
          prompts: {
            orderBy: {
              id: "asc",
            },
            include: {
              aiRequest: true,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("POST /api/components failed:", error);

    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        meta: error.meta,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(component, { status: 201 });
}

// app/api/components/route.ts
export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [components, entitlement] = await Promise.all([
      prisma.component.findMany({
        where: {
          userId,
        },
        include: {
          prompts: {
            orderBy: {
              id: "asc",
            },
            include: {
              aiRequest: true,
            },
          },
        },
        orderBy: [
          {
            updatedAt: "desc",
          },
          {
            id: "desc",
          },
        ],
      }),

      getUserEntitlement(userId),
    ]);

    const generationUsage = await getGenerationUsage(userId, entitlement);

    return NextResponse.json(
      {
        components,
        generationUsage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch components:", error);

    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 },
    );
  }
}
