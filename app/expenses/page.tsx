import Contents from "./_components/contents";
import Header from "./_components/header";
import Title from "./_components/title";

export default function ExpensesPage() {
  return (
    <div className="w-full flex flex-col flex-1">
      <Header />
      <Contents>
        <Title />
      </Contents>
    </div>
  );
}
