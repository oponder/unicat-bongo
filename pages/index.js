import Link from 'next/link'

const Index = () => (
  <div>

<Link href="/index_english">
  <a className="translation">Switch to human language</a>
</Link>

  <h1>Meow meow!</h1>
  <p>Meow meow meow meow meow meow.</p>
	<p> Meow meow meow??</p>
    <Link href="/game">
      <a class="play">Meow meow!</a>
    </Link>
  </div>
)

export default Index
