export default function Contact() {
	const handleSubmit = (e) => {
		e.preventDefault()
	}

	return (
		<div className="contact-page">
			<div className="contact-card">
				<h1>Contactez-nous</h1>
				<p className="lead">Une question ? Écrivez-nous via ce formulaire.</p>

				<form className="contact-form" onSubmit={handleSubmit}>
					<label className="field">
						<span>Nom</span>
						<input name="name" type="text" required />
					</label>

					<label className="field">
						<span>Email</span>
						<input name="email" type="email" required />
					</label>

					<label className="field">
						<span>Message</span>
						<textarea name="message" rows="5" required />
					</label>

					<div className="actions">
						<button type="submit" className="btn">Envoyer</button>
					</div>
				</form>
			</div>
		</div>
	)
}
