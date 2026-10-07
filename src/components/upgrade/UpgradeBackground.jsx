export default function UpgradeBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-[#070709]" />
      <div className="pointer-events-none fixed inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_24%,transparent_80%)]" />
      <div className="pointer-events-none fixed left-1/2 top-[-16rem] h-[44rem] w-[62rem] -translate-x-1/2 rounded-full bg-violet-600/[0.095] blur-[130px]" />
      <div className="pointer-events-none fixed bottom-[-18rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/[0.04] blur-[120px]" />
    </>
  );
}
