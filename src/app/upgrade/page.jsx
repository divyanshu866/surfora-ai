import TopBar from "@/components/upgrade/TopBar";
import UpgradeBackground from "@/components/upgrade/UpgradeBackground";
import UpgradeHero from "@/components/upgrade/UpgradeHero";
import CurrentPlanCard from "@/components/upgrade/CurrentPlanCard";
import UpgradeCard from "@/components/upgrade/UpgradeCard";
import ModelAccess from "@/components/upgrade/ModelAccess";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { getUserEntitlement } from "@/lib/billing/entitlements";
import { getCreditUsage } from "@/lib/billing/credit-usage";
export default async function UpgradePage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const entitlement = await getUserEntitlement(session.user.id);

  if (!entitlement?.plan) {
    throw new Error("Unable to resolve user entitlement");
  }

  if (entitlement.plan !== "FREE") {
    redirect("/workspace");
  }

  const creditUsage = await getCreditUsage(session.user.id, entitlement);
  const monthlyCreditsUsed = creditUsage.periods.MONTHLY.used;
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#070709] text-white antialiased selection:bg-violet-500/25">
      <UpgradeBackground />
      <TopBar />

      <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <section className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
          <div>
            <UpgradeHero />
            <div className="mt-8 max-w-xl">
              <CurrentPlanCard monthlyCreditsUsed={monthlyCreditsUsed} />
            </div>
          </div>

          <UpgradeCard userId={session.user.id} />
        </section>

        <ModelAccess />

        <footer className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-white/[0.05] pt-5 text-[10px] text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 SurforaAI</span>
          <span>Build the interface. Then keep improving it.</span>
        </footer>
      </div>
    </main>
  );
}
