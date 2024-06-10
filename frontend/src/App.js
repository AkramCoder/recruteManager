import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import { Provider } from 'react-redux';
import store from './store';

import SignUpForm from './pages/SignUpForm';
import CompleteSignUp from "./pages/CompleteSignUp";
import Login from './pages/login/Login';
import ResetPassword from "./pages/update/ResetPassword";
// home
import Home from './pages/home/Home';
// managers
import Listmanagers from './pages/list/Listmanagers';
import Profile from './pages/single/Profile';
import { managerInputs, candidateInputs } from "./formSource";

// candidates
import ListCandidates from './pages/list/ListCandidates';
import Candidate from './pages/single/Candidate';
// job offers
import List from './pages/list/List';
import Offer from './pages/single/Offer';
import NewJob from './pages/new/NewJob';
import Newjoboffer from './pages/new/Newjoboffer';
import New from './pages/new/New';
import UpdateOffer from "./pages/update/UpdateOffer";

// company
import Company from './pages/single/Company';
import NewCompany from './pages/new/NewCompany';
import UpdateCompany from './pages/update/UpdateCompany';
import Single from './pages/single/Single';

// events
import ListEvents from './pages/list/ListEvents';
import Event from './pages/single/Event';
import NewEvent from './pages/new/NewEvent';
import NewCandidateEvent from './pages/new/NewCandidateEvent';
import UpdateEvent from './pages/update/UpdateEvent';
import UpdateCandidateEvent from './pages/update/UpdateCandidateEvent';

// skill
import NewSkill from './pages/new/NewSkill';
import UpdateSkill from './pages/update/UpdateSkill';

// education

import Education from './pages/single/Education';
import NewEducation from './pages/new/NewEducation';
import UpdateEducation from './pages/update/UpdateEducation';
// experience
import NewExperience from './pages/new/NewExperience';
import UpdateExperience from './pages/update/UpdateExperience';
// Interview
import ListInterviews from './pages/list/ListInterviews';
import Interview from './pages/single/Interview';
import Questions from './pages/single/Questions';
import NewInterview from './pages/new/NewInterview';
import NewCandidateInterview from './pages/new/NewCandidateInterview';
import UpdateInterview from './pages/update/UpdateInterview';
import UpdateCandidateInterview from './pages/update/UpdateCandidateInterview';
// Cv
import NewCv from './pages/new/NewCv';
// import CvUploadForm from './pages/new/CvUploadForm';
import Cv from './pages/single/Cv';
import NewPermissions from "./pages/new/NewPermissions";
import NewCandidate from "./pages/new/NewCandidate";
import ListCvs from './pages/list/ListCvs';
import UpdateManager from "./pages/update/UpdateManager";



function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <AuthProvider>
                   {/* <Navbar/>*/}
                {/*<BrowserRouter>*/}
                    <Routes>
                        <Route path="/" element={<Home />} ></Route>
                        <Route path="/signup" element={<SignUpForm />} ></Route>
                        {/* <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} ></Route> */}
                        <Route path="/complete-reset-password/:uidb64/:token" element={<ResetPassword />} ></Route>
                        <Route path="/complete-signup" element={<CompleteSignUp />} ></Route>
                        <Route path="/login" element={<Login />} ></Route>
                        <Route path="company">
                            <Route index element={<Company title="manager" />} />
                            <Route path="new/" element={<NewCompany  />} />
                            <Route path="update/:companyId" element={<UpdateCompany  />} />
                        </Route>
                        <Route path="managers">
                            <Route index element={<Listmanagers title="manager" />} />
                            <Route path=":managerId" element={<Single />} />
                            <Route path="new" element={<New inputs={managerInputs} title="Ajouter manager" />} />
                            <Route path="update/:managerId" element={<UpdateManager inputs={managerInputs} title="Modifier manager" />} />
                            <Route path="update-permissions/:managerId" element={<NewPermissions  />} />
                        </Route>
                        <Route path="candidates">
                            <Route index element={<ListCandidates />} />
                            <Route path=":candidateId" element={<Candidate />} />
                            <Route path=":candidateId/neweducation" element={<NewEducation />} />
                            <Route path=":candidateId/newevent" element={<NewCandidateEvent />} />
                            <Route path=":candidateId/newexperience" element={<NewExperience />} />
                            <Route path=":candidateId/newinterview" element={<NewCandidateInterview />} />
                            <Route path=":candidateId/newskill" element={<NewSkill />} />
                            <Route path=":candidateId/skills/:skillId" element={<UpdateSkill />} />
                            <Route path=":candidateId/experiences/:experienceId" element={<UpdateExperience />} />
                            <Route path=":candidateId/educations/:educationId" element={<UpdateEducation />} />
                            <Route path=":candidateId/interviews/:interviewId/update" element={<UpdateCandidateInterview />} />
                            <Route path=":candidateId/events/:eventId" element={<UpdateCandidateEvent />} />
                            <Route path=":candidateId/interviews/:interviewId/questions" element={<Questions />} />
                            <Route path=":candidateId/interviews/:interviewId" element={<Interview />} />
                            
                            <Route path="new" element={<NewCandidate inputs={candidateInputs} title="Ajouter candidate" />} />

                        </Route>
                        <Route path="offers">
                            <Route index element={<List />} />
                            <Route path=":offerId" element={<Offer />} />
                            <Route path="new" element={<Newjoboffer />} />
                            <Route path="newjob" element={<NewJob />} />
                            <Route path="update/:offerId" element={<UpdateOffer />} />
                        </Route>
                        <Route path="events">
                            <Route index element={<ListEvents />} />
                            <Route path=":eventId" element={<Event />} />
                            <Route path=":eventId/update" element={<UpdateEvent />} />
                            <Route path="new" element={<NewEvent />} />
                            {/*<Route path="update/:eventId" element={<UpdateOffer />} />*/}
                        </Route>
                        <Route path="educations">
                            <Route index element={<ListEvents />} />
                            <Route path=":educationId" element={<Education />} />
                            {/*<Route path="new" element={<NewEducation />} />*/}
                           {/* <Route path="update/:educationId" element={<UpdateEducation />} />*/}
                        </Route>
                        <Route path="experiences">
                            <Route index element={<ListEvents />} />
                            <Route path=":experienceId" element={<Event />} />
                            <Route path="update/:experienceId" element={<NewExperience />} />
                            {/*<Route path="update/:experienceId" element={<UpdateOffer />} />*/}
                        </Route>
                        <Route path="skills">
                            <Route path=":skillId" element={<Event />} />
                            <Route path="new" element={<NewSkill />} />
                            {/*<Route path="update/:skillId" element={<UpdateOffer />} />*/}
                        </Route>
                        <Route path="interviews">
                            <Route index element={<ListInterviews />} />
                            <Route path=":interviewId" element={<Interview />} />
                            <Route path="new" element={<NewInterview />} />
                            <Route path=":interviewId/update" element={<UpdateInterview />} />
                        </Route>
                        <Route path="cvs">
                            <Route index element={<ListCvs />} />
                            <Route path=":cvId" element={<Cv />} />
                            <Route path="new" element={<NewCv />} />
                            {/* <Route path="new1" element={<CvUploadForm />} /> */}
                            {/* <Route path="update/:cvId" element={<UpdateOffer />} /> */}
                        </Route>
                        <Route path="/profile" element={<Profile />} ></Route>
                    </Routes>
                    {/*</BrowserRouter>*/}
                </AuthProvider>
            </div>
        </Provider>
    );
}

export default App;