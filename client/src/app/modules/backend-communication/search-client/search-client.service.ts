import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SearchResult } from "src/app/shared/models/search-result.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SearchClientService {
  private SEARCH_ENDPOINT: string = environment.serverURL + "/search";

  constructor(private httpClient: HttpClient) {}

  search(query: string): Observable<SearchResult> {
    return this.httpClient.get<SearchResult>(`${this.SEARCH_ENDPOINT}`, {
      params: new HttpParams().set("q", query),
    });
  }
}
