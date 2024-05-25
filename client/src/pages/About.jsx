import NavBarMain from '../components/NavBar';



function About() {

  return (
    <div className="min-vh-100 vw-100 background">
        <NavBarMain/>
        <div className='custom-card d-flex m-5'>
        <div className='col-md-6 m-3 p-3'>
                <h2>About Phase 5</h2>
                <p> Welcome to Phase 5 Project! Our mission is to bridge the gap between aspiring developers and nonprofits in need of technical assistance. We believe in the power of technology to drive positive change, and we're here to make it easier for entry-level developers to gain valuable experience while supporting causes they care about.</p>
                <h3>Our Mission</h3>
                <p>At Phase 5 Project, we aim to:</p>
                <ul>
                    <li><span className='fw-bold'>Empower Developers:</span> Provide entry-level developers with real-world projects to build their portfolios and enhance their skills.</li>
                    <br></br>
                    <li><span className='fw-bold'>Support Nonprofits:</span> Help nonprofits achieve their goals by offering a platform to connect with skilled volunteers willing to provide pro bono technical work.</li>
                    <br></br>
                    <li><span className='fw-bold'>Foster Collaboration:</span> Create a community where developers and nonprofits can collaborate, learn from each other, and make a meaningful impact.</li>
                </ul>
                <h3>How It Works</h3>
                <ol>
                    <li><span className='fw-bold'>Nonprofits Post Projects:</span> Nonprofits can sign up and post their technical projects, specifying their needs and requirements.</li>
                    <br></br>
                    <li><span className='fw-bold'>Developers Browse and Apply:</span> Developers can browse available projects, select ones that match their skills and interests, and apply to work on them.</li>
                    <br></br>
                    <li><span className='fw-bold'>Collaboration and Completion:</span> Once selected, developers and nonprofits collaborate to complete the project. Developers gain hands-on experience, and nonprofits receive valuable technical support.</li>
                </ol>
                <br></br>
                <p>Thank you for being a part of Phase 5 Project. Together, we can make a difference through technology and collaboration!</p>
            </div>
            <div className='col-md-6'>
                <h2 className='m-3 p-3'>FAQ's</h2>
                <ul>
                    <li className='fw-bold'><a href="#1">Is there a cost to use the platform?</a></li>
                    <br></br>
                    <li className='fw-bold'><a href="#2">How do I post a project?</a></li>
                    <br></br>
                    <li className='fw-bold'><a href="#3">How do developers apply for projects?</a></li>
                    <br></br>
                    <li className='fw-bold'><a href="#4">What types of projects can be posted?</a></li>
                    <br></br>
                    <li className='fw-bold'><a href="#5">How is the collaboration managed?</a></li>
                    <br></br>
                    <li className='fw-bold'><a href="#6">What happens after a project is completed?</a></li>
                    <br></br>
                    <li className='fw-bold'><a href="#7">Who should I contact for support or more information?</a></li>
                    <br></br>
                </ul>
            </div>
        </div>
        <div className='custom-card m-5'>
            <p id='1' className='fw-bold'>Is there a cost to use the platform?</p>
            <p>No, Phase 5 Project is completely free for both developers and nonprofits. We are committed to providing this service without any financial barriers.</p>
            <br></br>
            <p id='2' className='fw-bold'>How do I post a project?</p>
            <p>Nonprofits can sign up for an account and use the "Post a Project" feature to detail their project needs, including deadlines, required skills, and project scope.</p>
            <br></br>
            <p id='3' className='fw-bold'>How do developers apply for projects?</p>
            <p>Developers can browse the available projects, filter by their skills and interests, and apply directly through the platform. Nonprofits will review applications and select the best fit for their project.</p>
            <br></br>
            <p id='4' className='fw-bold'>What types of projects can be posted?</p>
            <p>Any technical project can be posted, including website development, app creation, database management, and more. If you have a project in mind, feel free to post it!</p>
            <br></br>
            <p id='5' className='fw-bold'>How is the collaboration managed?</p>
            <p>Once a developer is selected for a project, they can communicate directly with the nonprofit through our platform's messaging system. We encourage regular updates and clear communication to ensure successful project completion.</p>
            <br></br>
            <p id='6' className='fw-bold'>What happens after a project is completed?</p>
            <p>After completing a project, developers can request a testimonial from the nonprofit, which can be added to their portfolio. Nonprofits can also leave reviews for developers, helping to build their reputation in the community.</p>
            <br></br>
            <p id='7' className='fw-bold'>Who should I contact for support or more information?</p>
            <p>If you have any questions or need support, please contact us at support@phase5project.com. We're here to help!</p>
            <br></br>
        
        </div>

    </div>
  );
}

export default About;
