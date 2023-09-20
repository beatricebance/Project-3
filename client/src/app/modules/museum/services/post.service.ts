import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostInterface } from '../models/post.model';
import { CommentInterface } from '../models/comment.model';
import { Drawing } from 'src/app/shared';


@Injectable({
  providedIn: "root",
})

export class PostService{

  private endpointUrl: string = environment.serverURL + "/posts";
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    "ContentType",
    "application/json",
  );

  constructor(private httpClient: HttpClient,

    ) {}

  publishDrawing(drawingId: string, drawing: Drawing):Observable<PostInterface> { return this.httpClient
    .post<PostInterface>(`${environment.serverURL}/drawings/${drawingId}/publish`,
    drawing,
      {
      headers: this.httpHeaders,
    })
    .pipe((response) => {
      return response;
    });
  }

  getPosts(): Observable<PostInterface[]> {
    return this.httpClient
      .get<PostInterface[]>(this.endpointUrl)
      .pipe((response) => {
        return response;
      });
  }

  addComment(postId: string, comment: CommentInterface): Observable<CommentInterface> {
    return this.httpClient
      .post<CommentInterface>(`${this.endpointUrl}/${postId}/comments`,
        comment,
        {
        headers: this.httpHeaders,
      })
      .pipe((response) => {
        return response;
      });
  }

  addLike(userId: string, postId: string, ):Observable<PostInterface>{
    return this.httpClient
      .post<PostInterface>(`${this.endpointUrl}/${postId}/likes`, {
        userId: userId,
        postId: postId
      }, {
        headers: this.httpHeaders,
      })
      .pipe((response) => {
        return response;
      });
  }

  removeLike(userId: string, postId: string, ):Observable<PostInterface>{
    return this.httpClient
      .delete<PostInterface>(`${this.endpointUrl}/${postId}/likes`)
      .pipe((response) => {
        return response;
      });
  }

}
