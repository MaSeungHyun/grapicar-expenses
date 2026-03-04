import Contents from "./contents";
import Header from "./header";
import ContentItem from "./_components/content-item";

export default function ExpensesPage() {
  return (
    <div className="w-full flex flex-col flex-1">
      <Header />
      <Contents />
    </div>
  );
}
