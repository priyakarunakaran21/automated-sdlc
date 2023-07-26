import React, {useState} from 'react';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './style.scss';

function RequirementGathering() {
  const [formData, setFormData] = useState({});
  const [showFunctional, setShowFunctional] = useState(false);
  const [showNonFunctional, setShowNonFunctional] = useState(false);
  const [showTechLimit, setShowTechLimit] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Process form data here, use formData state for form values
    console.log(formData);

    // Call the submitForm function here if you want to keep the original functionality.
    // submitForm();
  };

  const handleFunctionalOptionChange = (event) => {
    setShowFunctional(event.target.value === 'Yes');
  };

  const handleNonFunctionalOptionChange = (event) => {
    setShowNonFunctional(event.target.value === 'Yes');
  };

  const handleTechLimitOptionChange = (event) => {
    setShowTechLimit(event.target.value === 'Yes');
  };

  return (
    <>
    <Header/>
    <div>
      <div class="container">
    <form id="myForm">
    <main>
      <div class="column">
        
        <h2>Project Requirement:</h2>

        <div class="form-field">
          <label>Project Type</label>
          <div class="control-wrap">
          <div>
            <input type="radio" id="newproject" name="projectType" value="newproject" checked/>
            <label class="radio-label" for="newproject">New project</label>
          </div>
          <div>
            <input type="radio" id="changeproject" name="projectType" value="changeproject"/>
            <label class="radio-label" for="changeproject">Existing project</label>
          </div>
        </div>
        </div>

        <div class="form-field">
          <label>Requirement Type</label>
          <div class="control-wrap">
          <div>
            <input type="radio" id="newrequest" name="requirementType" value="newrequest" />
            <label class="radio-label" for="newrequest">New request</label>
          </div>
          <div>
            <input type="radio" id="changerequest" name="requirementType" value="changerequest"/>
            <label class="radio-label" for="changerequest">Change request</label>
          </div>
        </div>
        </div>

         <div class="floating">
          <select id="department" name="department" class="custom-select" required >
            <option value="" selected disabled hidden> </option>
            <option value="healthcare">Healthcare</option>
            <option value="insurance">Insurance</option>
            <option value="nursing">Nursing</option>
          </select>
          <label for="department">Department</label>
        </div>
        <div class="floating">
          <select id="sub-department" name="sub_department" class="custom-select" required>
            <option value="" selected disabled hidden> </option>
            <option value="usermanagement">User Management</option>
            <option value="systemadmin">System Admin</option>
            <option value="operations">Operations</option>
            <option value="clinicalservices">Clinical Services</option>
          </select>
          <label for="department">Sub-Department</label>
        </div>
        <div class="floating">
          <textarea id="problem-statement" name="problemStatement" placeholder=" " required></textarea>
          <label for="problem-statement">Problem Statement</label>
        </div>
        <div class="floating">
          <textarea id="goals" name="goals" placeholder=" " required></textarea>
          <label for="goals">Objective/Goals</label>
        </div>
        <div class="floating">
          <textarea id="business-value" name="businessValue" placeholder=" " required></textarea>
          <label for="business-value">Business Value</label>
        </div>
        <div class="floating">
		      <input type="text" id="budget" name="budget"  placeholder=" " />
          <label for="budget">Budget</label>
        </div>
        <div class="floating">
		      <input type="text" id="timeline" name="timeline"  placeholder=" " />
          <label for="timeline">Timeline</label>
        </div>
        
        <div class="floating">
          <textarea id="additional-notes" name="additionalNotes" placeholder=" "></textarea>
          <label for="additional-notes">Additional Notes</label>
        </div>

      </div>
      
     
      <div class="column">
        <h2>User Information:</h2>

        <div class="floating">
		      <input type="text" id="name" name="requestorName"  placeholder=" " required />
          <label for="name">Name</label>
        </div>

        <div class="floating">
          <input type="email" id="email" name="requestorEmail"  placeholder=" " required />
		      <label for="email">Email</label>
        </div>
        <div class="floating">
          <select id="team" name="team" class="custom-select" required >
            <option value="" selected disabled hidden> </option>
            <option value="devOps">DevOps</option>
            <option value="ui">UI</option>
            <option value="operations">Operations</option>
            <option value="automation">Automation</option>
          </select>
          <label for="team">Team</label>
        </div>

        <div class="floating">
          <select id="role" name="role" class="custom-select" required>
            <option value="" selected disabled hidden> </option>
            <option value="administrator">Administrator</option>
            <option value="manager">Manager</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <label for="role">Role</label>
        </div>
        <h2>Additional Information:</h2>
        
        <div class="datetime-wrapper">
        <div class="floating">
          <input type="date" id="datepicker" name="requirementsCapturingCallDate" />
          <label for="datepicker">Follow up call</label>
        </div>
        <div class="floating">
          <select id="hoursSelect" name="hours" class="custom-select" required>
            <option value="" selected disabled hidden></option>
            <option value="00">00</option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
          </select>
          <label for="hoursSelect">Hrs</label>
        </div>
        <div class="floating">
          <select id="minutesSelect" name="minutes" class="custom-select" required>
            <option value="" selected disabled hidden></option>
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
          <label for="minutesSelect">Mins</label>
        </div>
        <div class="floating">
          <input type="text" id="timezone" name="timezone" placeholder=" " required/>
          <label for="timezone">Timezone</label>
        </div>
      </div>
       
        <div class="floating">          
          <textarea id="attendees" name="attendees"  placeholder=" "  required></textarea>
		      <label for="attendees">Attendees (Enter email with comma separated)</label>
        </div>
        <div class="floating">          
          <textarea id="additional-comments" name="additionalComments"  placeholder=" " ></textarea>
		    <label for="additional-comments">Additional Comments</label>
        </div>
        <div>
          <div class="form-field">
            <label>Do you have any functional requirements?</label>
            <div class="control-wrap">
              <div>
                <input type="radio" id="functionalReqYes" name="function-requirement" value="Yes" />
                <label class="radio-label" for="functionalReqYes">Yes</label>
              </div>
              <div>
                <input type="radio" id="functionalReqNo" name="function-requirement" value="No" checked/>
                <label class="radio-label" for="functionalReqNo">No</label>
              </div>
            </div>
          </div>
  
          <div class="floating" id="functional-inputs" style={{display: 'none'}}>          
            <textarea id="functional-inputs-comments" name="functional-inputs-comments"  placeholder=" " ></textarea>
          <label for="functional-inputs-comments">Functional Requirements</label>
          </div>
        </div>
        <div>
          <div class="form-field">
            <label>Do you have any non functional requirements?</label>
            <div class="control-wrap">
              <div>
                <input type="radio" id="nonfunctionalReqYes" name="nonfunction-requirement" value="Yes" />
                <label class="radio-label" for="nonfunctionalReqYes">Yes</label>
              </div>
              <div>
                <input type="radio" id="nonfunctionalReqNo" name="nonfunction-requirement" value="No" checked/>
                <label class="radio-label" for="nonfunctionalReqNo">No</label>
              </div>
            </div>
          </div>
          
          <div class="floating" id="nonfunctional-inputs" style={{display: 'none'}}>          
            <textarea id="nonfunctional-inputs-comments" name="nonfunctional-inputs-comments"  placeholder=" " ></textarea>
          <label for="nonfunctional-inputs-comments">Non-Functional Requirements</label>
          </div>
          </div>
  
          <div>
          <div class="form-field">
            <label>Do you have any Technical limitations?</label>
            <div class="control-wrap">
              <div>
                <input type="radio" id="techlimitYes" name="technical-limitation" value="Yes" />
                <label class="radio-label" for="techlimitYes">Yes</label>
              </div>
              <div>
                <input type="radio" id="techlimitNo" name="technical-limitation" value="No" checked/>
                <label class="radio-label" for="techlimitNo">No</label>
              </div>
            </div>
          </div>
          <div class="floating" id="tech-limit-input" style={{display: 'none'}}>          
            <textarea id="tech-limit-input-comments" name="tech-limit-input-comments"  placeholder=" " ></textarea>
          <label for="tech-limit-input-comments">Technical limitations</label>
          </div>
        </div>


        <div class="import" style={{display: 'none'}}>
          <label>Add supporting documents (if any)</label>
          <a href="">Add Import</a>
        </div>
       
      </div>
      <div class="full-column">
        <div class="btn-container">
          <input class="secondary-btn" type="button" value="cancel"/><input class="primary-btn" type="submit" value="Submit"/>
        </div>
      </div>
    </main>
  </form>
  </div>
 
    </div>
    <Footer/>
    </>
  );
}

export default RequirementGathering;
