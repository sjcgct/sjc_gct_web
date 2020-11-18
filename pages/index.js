import Head from 'next/head'
import React from 'react'
import { getAllBlogsForHome, getAllHogsForHome } from '../prismic-configuration'
import Layout from '../components/Layout'
import Deck from '../components/deck'

export default function BlogHome ({ preview, allBlogs, allHogs }) {
  const morePosts = allBlogs
  return (
    <Layout>
      <Head>
        <title>Student Journalist Gouncil - GCT</title>
      </Head>

      <div className='home-blog-section'>
        <h2>Blog</h2>
        {morePosts && (
          <Deck
            cards={morePosts}
            type='blogs'
          />
        )}
      </div>

      <section className='home-hog-section'>
        <h2>Humans of GCT</h2>

        {allHogs && (
          <Deck
            cards={allHogs}
            type='hog'
          />
        )}
      </section>
    </Layout>
  )
}

export async function getServerSideProps ({ preview = false, previewData }) {
  const blogs = await getAllBlogsForHome(' ', 6)
  const hogs = await getAllHogsForHome(' ', 6)
  var allBlogs = blogs.edges
  var allHogs = hogs.edges
  return {
    props: { preview, allBlogs, allHogs }
  }
}
