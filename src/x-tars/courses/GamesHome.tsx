import PageMeta from "../../components/common/PageMeta";
import KidsMainPage from "./Kids/MainModule/KidsMainPage";

export default function GamesHome() {
  return (
    <>
      <PageMeta
        title="Home - Games"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <KidsMainPage/>
    </>
  );
}
