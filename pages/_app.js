import React from 'react';
import App, { Container } from 'next/app'; 
import Link from 'next/link'


export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <link type="text/css" rel="stylesheet"  href="/static/style.css" /> 
        <div id="site-content">
        <div className="content">
          <Component {...pageProps} />
        </div>
        </div>
      </Container>
    )
  }
}