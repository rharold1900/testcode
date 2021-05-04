import React, { Component } from 'react';
import './patient.css'

class App extends Component {

    constructor(props) {
        super(props);

        this.handleChangeLastName  = this.handleChangeLastName.bind(this);
        this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
        this.handleChangeBirthday  = this.handleChangeBirthday.bind(this);
        this.handleChangeGender    = this.handleChangeGender.bind(this);
        this.dataGet  = this.dataGet.bind(this);
        this.dataSend = this.dataSend.bind(this);
        
        this.state = {

            Patient_ID 	: "",
            LastName   	: "",
            FirstName  	: "",
            Birthday   	: "",
            Gender     	: "1", // default value required

            messageStatus : 'Please enter first and last name for patient'
        }

    }

    genderIDToText( id ) {

        if (id === "1") return "Male"
        if (id === "2") return "Female"

        return "NotSpecified";
    }
    
    genderTextToID( textValue ) {

        if (textValue === "Male") return "1";
        if (textValue === "Female") return "2";

    return 3;
    }
    
    async dataSend() {
        console.log("dataSend");
        this.setState( {messageStatus : ""});

        try { 

            // check for serious input errors
            if ((this.state.LastName === "") || (this.state.FirstName === "") || (this.state.Birthday === "") || (this.state.Gender === "")) {
                alert( "Patient fields cannot be empty");
                return;
            }

            let result = await fetch('https://b5ra65vcac.execute-api.us-east-1.amazonaws.com/dev/patient', { 
                method: 'post',
                mode:  'no-cors',
                headers: {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json',
                }, 
                body: JSON.stringify( {
                    "Patient_ID" 	: this.state.LastName + "-" + this.state.FirstName,
                    "LastName"   	: this.state.LastName,
                    "FirstName"  	: this.state.FirstName,
                    "Birthday"   	: this.state.Birthday,
                    "Gender"     	: this.genderIDToText( this.state.Gender )
                })
            });
            
            this.setState( {messageStatus : "Patient set"});
            console.log( result )
            
        } catch(e) {
            console.log(e)
        }
    }

    async dataGet() {
        console.log("dataGet");
        this.setState( {messageStatus : ""});

        // check for serious input errors
        if ((this.state.LastName === "") || (this.state.FirstName === "")) {
            alert( "Patient fields LastName and FirstName are required");
            return;
        }

        let Patient_ID = this.state.LastName + "-" + this.state.FirstName;
        console.log( Patient_ID );

        fetch('https://b5ra65vcac.execute-api.us-east-1.amazonaws.com/dev/patient?Patient_ID=' + Patient_ID )
            .then( res => res.json())
            .then( json => {
                console.log( json );

                if ("errormessage" in json) {
                    this.setState( {messageStatus : "Unable to locate patient"});

                } else {
                    
                    if (("LastName" in json) && ("FirstName" in json) && ("Birthday" in json) && ("Gender" in json)) {

                        console.log( "get update state" );
                        
                        this.setState( {LastName : json.LastName });
                        this.setState( {FirstName : json.FirstName });
                        this.setState( {Birthday : json.Birthday });
                        this.setState( {Gender : this.genderTextToID( json.Gender ) });
                        this.setState( {messageStatus : "Patient found"});

                    } else {
                        console.log( "get parameters fail" );
                        alert("Bad response from server.  "); // should be done another way and not here
                    }

                }

                
            });
     
        

    }

    handleChangeLastName(event) {
        // handle input errors

        this.setState( {LastName : event.target.value});
        this.setState( {messageStatus : ""});
    }
    
    handleChangeFirstName(event) {
        // handle input errors
        
        this.setState( {FirstName : event.target.value});
        this.setState( {messageStatus : ""});
    }
    
    handleChangeBirthday(event) {
        // handle input errors, check format

        this.setState( {Birthday : event.target.value});
        this.setState( {messageStatus : ""});
    }
    
    handleChangeGender(event) {
        // handle input errors, check allowed values

        this.setState( {Gender : event.target.value  });
        this.setState( {messageStatus : ""});
    }
    

    //                 <input className="PatientClass-Edit" value={this.state.Gender}  onChange={this.handleChangeGender} /><br></br>
    //                  <input className="PatientClass-Edit" value={this.state.Birthday}  onChange={this.handleChangeBirthday} /><br></br>

    render() { 
        console.log("render");

        return ( 
          <div> 

            <div className="PatientClass-Main">
                <div className="PatientClass-Top"> 
                    <div className="PatientClass-Title"> Patient AI Engine </div> 
                </div> 

                <div className="PatientClass-DataArea">
                <span className = "PatientClass-StaticTextLeft">
                    <div className="PatientClass-Text"> Last Name:</div>
                    <div className="PatientClass-Text"> First Name:</div>
                    <div className="PatientClass-Text"> Birthday:</div>
                    <div className="PatientClass-Text"> Gender:</div>
                </span> 
            
                <span className = "PatientClass-DataTextRight">
                    <input className="PatientClass-Edit" value={this.state.LastName}  onChange={this.handleChangeLastName}  />
                    <input className="PatientClass-Edit" value={this.state.FirstName}  onChange={this.handleChangeFirstName} />

                    <input type="date" className="PatientClass-Date" value={this.state.Birthday} onChange={this.handleChangeBirthday}
                 
                        min="1900-01-01" max="2020-12-31">
                    </input>
                    <br></br>

                    <select className="PatientClass-Gender" value={this.state.Gender} onChange={this.handleChangeGender}>
                        <option value="1">Male</option>    
                        <option value="2">Female</option>
                        <option value="3">NotSpecified</option>
                    </select>

                    <br></br><br></br>
                </span>
                </div> 

                <div className = "PatientClass-ButtonArea">
                    <button className="PatientClass-Button" onClick={ () => this.dataSend() }>Send Patient Data</button>
                    <button className="PatientClass-Button" onClick={ () => this.dataGet() }>Get Patient Data</button><br></br>
                </div>

                <div className = "PatientClass-MessageArea">
                    <p className = "PatientClass-Message">{this.state.messageStatus}</p>
                </div>

    
            </div>
          </div>
        );
    }
}
 
export default App;