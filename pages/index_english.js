import Link from 'next/link'

const Index = () => (
  <div>
  <Link href="/index">
  <a className="translation">Switch to cat</a>
</Link>
  <h1>Unicat Bongo!</h1>
  <p>You must be here to play. 
</p>
	<p>Are you ready??</p>
    <Link href="game">
      <a class="play">Let's go!</a>
    </Link>
  </div>
)

export default Index
