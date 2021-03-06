import Layout from '../components/Layout'
import { getAllApertures } from '../prismic-configuration'
import React, { Component } from 'react'
import { PrismicLink } from 'apollo-link-prismic'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'
import Head from 'next/head'
import ApertureDeck from '../components/AperturePage/aperturedeck'

const apolloClient = new ApolloClient({
  link: PrismicLink({
    uri: 'https://sjcgctrepo.prismic.io/graphql',
    accessToken: process.env.PRISMIC_TOKEN
  }),
  cache: new InMemoryCache()
})

class AperturePage extends Component {
  constructor (props) {
    super(props)
    var page_arr = []
    page_arr[0] = props.cursor
    this.state = {
      activePage: 0,
      total: props.totalCount,
      apertures: props.apertures,
      rediret: false,
      cursor: props.cursor,
      hasnext: props.hasnext,
      page_arr: page_arr,
      loadedtill: 0,
      loading: false,
      categoryId: props.categoryId,
      itemsPerPage: props.itemsPerPage,
      isFrameLoading: true
    }
  }

  async loadPage (page) {
    var cursor = this.state.cursor

    var apertures = ''
    var curs = ''
    var hasnext = ''
    this.state.activePage = page

    var shallWeStore = true
    if (this.state.loadedtill >= page) {
      shallWeStore = false
      cursor = this.state.page_arr[page - 1]
    } else {
      this.state.loadedtill = this.state.loadedtill + 1
    }
    this.setState({ loading: true })
    apolloClient.query({
      query: this.getAllApertures(cursor, this.state.itemsPerPage)
    }).then(response => {
      apertures = response.data.allAperturess.edges
      curs = response.data.allAperturess.pageInfo.endCursor
      hasnext = response.data.allAperturess.pageInfo.hasNextPage
      if (shallWeStore === true) {
        this.state.page_arr[this.state.loadedtill] = curs
      }
      this.setState({ apertures: apertures, cursor: curs, hasnext: hasnext, loading: false })
    }).catch(error => {
      console.error('error')
      alert(error)
    })
  }

  getAllApertures (cursor, limit) {
    const query = gql`{
      allAperturess(after:"${cursor}",first:${limit}) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            description
            title
            link
          }
        }
      }
    }`
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
    return (
      <Layout menu='aperture'>
        <Head>
          <title>Aperture Newsletter | Student Journalist Gouncil - GCT</title>
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
          <meta
            name='Keywords'
            content='Government College of Technology, GCT, Student Media Body, Student Journalist Council, Student Journalist Council - GCT, Aperture, Aperture Newsletter, GCT Magazine, Student Magazine of GCT'
          />
          <meta
            name='Description'
            content='
           Student Journalist Council-GCT is the Student Media Body of Government College of Technology, Coimbatore. It covers and reports the
           various events and activities happening inside the campus.  It also steers "Humans of GCT", a storytelling project and publishes the student newsletter "Aperture".
          '
          />
          <link rel='canonical' href='https://www.sjcgct.in/aperture' />
          <meta name='robots' content='index, follow' />
          <script src='//static.fliphtml5.com/web/js/plugin/LightBox/js/fliphtml5-light-box-api-min.js' />
        </Head>

        <div className='heading'>
          <h2>Aperture Newsletter</h2>
        </div>

        {this.state.apertures && (
          <ApertureDeck
            cards={this.state.apertures}
          />
        )}

        <div className='pagination-container'>
          <div className='pagination'>
            <div className='previous-container'>
              <button className='button' hidden={this.state.activePage === 0} onClick={() => this.prevPage()}>
              Previous
              </button>
            </div>
            <div className='next-container'>
              <button className='button' hidden={!this.state.hasnext} onClick={() => this.nextPage()}>
              Next
              </button>
            </div>
          </div>
        </div>
      </Layout>

    )
  }
}

export default AperturePage

export async function getStaticProps () {
  var itemsPerPage = 8
  var apertureResponse = await getAllApertures(' ', itemsPerPage)
  var apertures = apertureResponse.edges
  var cursor = apertureResponse.pageInfo.endCursor
  var hasnext = apertureResponse.pageInfo.hasNextPage
  var totalCount = apertureResponse.totalCount
  return {
    props: { apertures, cursor, totalCount, hasnext, itemsPerPage },
    revalidate: 1
  }
}
