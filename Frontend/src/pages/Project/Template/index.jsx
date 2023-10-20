import OpenSeaCom from './components/OpenSeaCom' // Import the Custom component

const Metadata = ({ setStep, setProject, project }) => {
	return (
		<div className='mt-3'>
			<h2>Mantle Metadata </h2>
			<OpenSeaCom project={project} setStep={setStep} setProject={setProject} />
		</div>
	)
}

export default Metadata
