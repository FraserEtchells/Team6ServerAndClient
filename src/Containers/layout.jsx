// import React, { Component } from 'react';
// import MainMenu from '../Components/MainMenu';
// import Quiz from '../Components/Quiz';
// import {Route, Switch} from 'react-router-dom';
// import openSocket from "socket.io-client";

// const socket= openSocket("http://localhost:4000");


// //import routes from '../routes';




// class App extends Component {
// render(){
//   return (
//     <React.Fragment>
        
//         <Switch>
//             <Route path="/" exact component={MainMenu} />
//             <Route path="/quiz" component={() => <Quiz socket={socket} />} />
            
           
//         </Switch>
//     </React.Fragment>
    
//   );
// }
// }
// export default App;



import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
  } from "react-router-dom";

import MainMenu from '../Components/MainMenu';
import Quiz from '../Components/Quiz';
import openSocket from "socket.io-client";

const socket = openSocket("http://demoteam6.azurewebsites.net");
  


class Main extends Component {

render() {
    return (
        <HashRouter>
            <div>
                {/* <ul className="header">
                    <li><NavLink to="/main-menu">Home</NavLink></li>
                    <li><NavLink to="/index-custom-page">Customisation</NavLink></li>
                    <li><NavLink to="/quiz-page">Quiz</NavLink></li>
                </ul> */}
                <div className="content">
                    <Route exact path="/" component={MainMenu}/>
                    <Route path="/quiz" component={() => <Quiz socket={socket} />}/>
                </div>
            </div>
        </HashRouter>
    );
  }
}


export default Main;


