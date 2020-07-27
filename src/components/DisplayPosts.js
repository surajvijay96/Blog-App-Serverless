import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listPosts } from '../graphql/queries';
import DeletePost from './DeletePost';
import EditPost from './EditPost';
import { onCreatePost, onDeletePost, onUpdatePost } from '../graphql/subscriptions'
import { deletePost } from '../graphql/mutations';
import CreateCommentPost from './CreateCommentPost';

class DisplayPosts extends Component{

    state = {
        posts : []
    }

    componentDidMount = async () => {
        this.getPosts();

        this.createPostListener =  API.graphql(graphqlOperation(onCreatePost))
        .subscribe({
                next: postData =>{
                    const newPost = postData.value.data.onCreatePost
                    const prePosts = this.state.posts.filter(post => post.id !== newPost.id)
                    const updatedPosts = [newPost, ...prePosts]
                    this.setState({posts : updatedPosts})
                }
            }
        )

        this.deletePostListener = API.graphql(graphqlOperation(onDeletePost))
        .subscribe({
                next: postData => {
                    const deletedPost = postData.value.data.onDeletePost;
                    const updatedPosts = this.state.posts.filter( post => post.id !== deletedPost.id);
                    this.setState({ posts : updatedPosts })
                }
            }
        )

        this.updatePostListener = API.graphql(graphqlOperation (onUpdatePost))
        .subscribe({
                next: postData => {
                    const { posts } = this.state;
                    const updatedPost = postData.value.data.onUpdatePost;
                    const index = posts.findIndex(post => post.id === updatedPost.id);
                    const updatedPosts = [
                        ...posts.slice(0,index),
                        updatedPost,
                        ...posts.slice(index+1)
                    ]
                    this.setState({posts : updatedPosts});
                }
            }
        )
        
    }

    componentWillUnmount(){
        this.createPostListener.unsubscribe();
    }

    getPosts = async() => {
        const result = await API.graphql(graphqlOperation(listPosts));
        //console.log(JSON.stringify(result.data.listPosts.items));
        this.setState({ posts : result.data.listPosts.items});
    }

    render(){
        const { posts } = this.state;

        return posts.map(( post ) =>{
            return (
                <div className="posts" id = { post.id } style = { rowStyle } key={post.id}>
                    <h1> { post.postTitle } </h1>
                    <span style = {{fontStyle : "italic" , color : "#0ca5e297"}}>
                        {"Wrote by :"} { post.postOwnerUsername }
                        { " on " }
                        <time style = {{fontStyle : "italic"}}>
                            {" "}
                            { new Date(post.createdAt).toDateString() }
                            
                        </time>
                    </span>
                 <p>{post.postBody}</p>
                 <br />
                 <span>
                    <DeletePost data = { post }/>
                    <EditPost {...post} />                
                </span>
                <span>
                    <CreateCommentPost postId={post.id} />
                </span>
                </div>
            )
        })
    }
}

const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}
export default DisplayPosts;