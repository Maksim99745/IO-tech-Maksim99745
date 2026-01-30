import { Metadata } from "next";
import SearchResults from "./SearchResults";

export const metadata: Metadata = {
  title: "Search | IO Tech",
  description: "Search for services and team members",
};

export default function SearchPage() {
  return <SearchResults />;
}
