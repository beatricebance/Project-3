import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SearchResult } from "src/app/shared/models/search-result.model";
import { SearchClientService } from "../../backend-communication/search-client/search-client.service";

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string;
  searchResults: SearchResult;

  searchCompleted: Promise<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchClient: SearchClientService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchQuery = params.q;
      this.searchClient.search(this.searchQuery).subscribe((searchResult) => {
        this.searchResults = searchResult;
        console.log(this.searchResults);

        this.searchCompleted = Promise.resolve(true);
      });
    });
  }

  ngOnInit(): void {}
}
