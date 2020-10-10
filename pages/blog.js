import React, { Component } from 'react'
import { getAllBlogsForHome } from '../prismic-configuration'
import { Nav, NavDropdown, Navbar, Button, Form, FormControl } from 'react-bootstrap'
import { queryAllBlogsForHome } from '../blog-api'
import Layout from '../components/Layout'
import CategoryNavBar from '../components/blogsubmenu'
import Deck from '../components/deck'
import { PrismicLink } from 'apollo-link-prismic'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'
import Loading from 'react-simple-loading'
import LoaderDeck from '../components/loaders/loaderDeck'

const apolloClient = new ApolloClient({
  link: PrismicLink({
    uri: 'https://sjcgctrepo.prismic.io/graphql',
    accessToken: process.env.PRISMIC_TOKEN
  }),
  cache: new InMemoryCache()
})

class BlogPage extends Component {
  constructor (props) {
    super(props)
    var page_arr = []
    page_arr[0] = props.cursor
    this.state = {
      activePage: 0,
      total: props.totalCount,
      blogs: props.blogs,
      rediret: false,
      cursor: props.cursor,
      hasnext: props.hasnext,
      page_arr: page_arr,
      loadedtill: 0,
      loading: false
    }
    console.log(this.state.loadedtill)
  }

  async loadPage (page) {
    // console.log(this.getBlogForNextOrPrevPage(action,cursor,limit));
    var cursor = this.state.cursor
    var limit = 9

    var blogs = ''
    var curs = ''
    var hasnext = ''
    this.state.activePage = page
    // alert(this.state.activePage)

    var shallWeStore = true
    if (this.state.loadedtill >= page) {
      // alert("alread loaded")
      shallWeStore = false
      cursor = this.state.page_arr[page - 1]
    } else {
      // alert("newly loading")
      this.state.loadedtill = this.state.loadedtill + 1
    }
    this.setState({ loading: true })
    apolloClient.query({
      query: this.getBlogForNextOrPrevPage(cursor, limit)
    }).then(response => {
      console.log('success')
      blogs = response.data.allBlogss.edges
      curs = response.data.allBlogss.pageInfo.endCursor
      hasnext = response.data.allBlogss.pageInfo.hasNextPage
      if (shallWeStore === true) {
        this.state.page_arr[this.state.loadedtill] = curs
      }
      this.setState({ blogs: blogs, cursor: curs, hasnext: hasnext, loading: false })
    }).catch(error => {
      console.error('error')
      alert(error)
    })

    // alert(this.state.loadedtill+" max")
    for (var i = 0; i < this.state.loadedtill; i++) {
      // alert(this.state.page_arr[i])
      console.log('hi')
    }
  }

  getBlogForNextOrPrevPage (lastPostCursor, limitation) {
    const query = gql`${queryAllBlogsForHome({ lastPostCursor, limitation })}`
    return query
  }

  async nextPage () {
    await this.loadPage(this.state.activePage + 1)
  }

  async prevPage () {
    if (this.state.activePage - 1 === 0) {
      this.state.hasprev = false
    }
    await this.loadPage(this.state.activePage - 1)
  }

  render () {
    if (this.state.loading) {
      return (
        <Layout>
          <div className='search-container container'>
            <form className='search-form' id='SearchForm'>
              <div className='search-bar-holder container mx-auto'>
                <input className='searchbar ml-3' type='text' placeholder='Search articles' id='addInput' title='Search' />
                <a href='#'> <img className='search-icon' src='/search.svg' title='Search by Voice' /></a>
              </div>
            </form>
          </div>
          <CategoryNavBar />
          <LoaderDeck />
        </Layout>
      )
    }

    return (
      <Layout>
        <div className='search-container container'>
          <form className='search-form' id='SearchForm'>
            <div className='search-bar-holder container mx-auto'>
              <input className='searchbar ml-3' type='text' placeholder='Search articles' id='addInput' title='Search' />
              <a href='#'> <img className='search-icon' src='/search.svg' title='Search by Voice' /></a>
            </div>
          </form>
        </div>
        <CategoryNavBar />
        {this.state.blogs && (
          <Deck
            cards={this.state.blogs}
            type='blog'
          />
        )}

        <button hidden={this.state.activePage === 0} onClick={() => this.prevPage()}>
         Previous
        </button>

        <p> </p>

        <button hidden={!this.state.hasnext} onClick={() => this.nextPage()}>
          Next
        </button>

      </Layout>

    )
  }
}

export default BlogPage

export async function getServerSideProps () {
  const posts = await getAllBlogsForHome(' ', 9)
  var blogs = posts.edges
  var cursor = posts.pageInfo.endCursor
  var totalCount = posts.totalCount
  var hasnext = posts.pageInfo.hasNextPage
  return {
    props: { blogs, cursor, totalCount, hasnext }
  }
}
