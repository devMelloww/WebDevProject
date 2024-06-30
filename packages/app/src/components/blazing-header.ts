import { LitElement, css, html } from "lit";
import { Events } from "@calpoly/mustang";

export class BlazingHeaderElement extends LitElement {

  render() {
    return html`
      <header>
        <!-- TODO: insert contents of header here -->
        <nav class="w3-bar w3-black">
          <a href="#home" class="w3-button w3-bar-item">Home</a>
          <a href="./pages/countries.html" class="w3-button w3-bar-item"
            >countries</a
          >
          <a href="./pages/contact.html" class="w3-button w3-bar-item"
            >Contact</a
          >
        </nav>
      </header>

      <label @change=${toggleDarkMode}>
    <input type="checkbox" autocomplete="off" />
    Dark mode
  </label>
    `;
  }

  static styles = css`
    /* TODO: Style the header here */
    * {
    font-family: "Protest Riot", sans-serif;
    margin: 0;
    padding: 0;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  /* CSS for Navbar */
  
  .w3-bar {
    width: 100%;
    overflow: hidden;
    background-color: #28282b;
  }
  
  .w3-bar a {
    float: left;
    display: block;
    color: #ff6347;
    text-align: center;
    padding: 14px 20px;
    text-decoration: none;
  }
  
  .w3-bar a:hover {
    background-color: #ff6347;
    color: white;
  }
  
  .section-content {
    position: relative;
  }
  
  .intro-msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 800px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    font-size: 25px;
    color: #e5e4e2;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    border-radius: 15px;
    box-shadow: 5px 10px rgba(255, 255, 255, 0.5);
    border: 4px solid white;
    transition: top 0.3s;
  }
  
  .intro-msg:hover {
    border-color: #ff6347;
    box-shadow: 5px 10px rgba(255, 99, 71, 0.5);
  }
  
  .intro-msg.fixed {
    position: fixed;
    margin-top: 0;
    top: 10px; /* Adjust as needed */
  }
  
  .w3-row-padding {
    display: flex;
    flex-wrap: wrap;
  }
  
  .flex-container {
    display: flex;
  }
  
  .flex-container img {
    flex: 1;
    border-radius: 90px;
  }
  
  .info-container p {
    color: #343434;
    flex: 1;
    padding: 20px;
    font-size: 20px;
    margin: 20px;
    font-family: "Caveat", cursive;
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Align items (including the button) to the center horizontally */
    text-align: center; /* Align text inside the div to the center */
  }
  
  .info-container button {
    margin: -10px 0px 20px 0px; /* Add some space between the paragraphs and the button */
    width: 200px;
    height: 50px;
    border-radius: 10px;
    background-color: #ff6347;
    color: white;
    border: 2px solid black;
  }
  
  .info-container button:hover {
    border: 3px solid black;
  }
  
  
  .flex-container h1 {
    color: #1b1212;
    padding: 20px;
    margin: 50px 20px -20px 20px;
    text-align: center;
    font-size: 50px;
  }
  
  .flex-container h2 {
    color: #1b1212;
    padding: 10px;
    text-align: center;
    margin: 0px 20px 20px 20px;
  }
  
  .w3-third {
    background-color: #f0ffff;
    width: 100%;
  }
  
  .pt {
    border-top: 5px solid black;
  }
  
  .w3-third img {
    width: 50%;
    padding: 50px 20px 50px 50px;
  }
  
  .w3-container {
    margin: -5px 0px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh; /* Set height to 100% of the viewport height */
  }
  
  .w3-container p {
    margin: 0; /* Remove the default margin */
    text-align: center;
    font-size: 30px;
    color: #e5aa70;
  }
  
  .img-b {
    background-image: url("../images/banner.jpg");
    background-size: cover;
    background-position: center;
    height: 50vh; /* Set the height to fill the viewport height */
  }
  
  .flex-container2 {
    display: flex;
    flex-direction: row-reverse; /* Reverse the order of the flex items */
    background-color: #A7C7E7;
    border-bottom: 5px solid black;
    border-top: 5px solid black;
  }
  
  .flex-container2 img {
    flex: 1;
    max-width: 100%; /* Ensure the image doesn't exceed the container width */
    margin-left: 20px; /* Add some space between the image and text */
    border-radius: 90px;
  }
  
  .flex-container2 div {
    flex: 1;
  }
  
  .flex-container2 h1 {
    color: #1b1212;
    padding: 20px;
    margin: 50px 20px -20px 20px;
    text-align: center;
    font-size: 50px;
  }
  
  .flex-container2 h2 {
    color: #1b1212;
    padding: 10px;
    text-align: center;
    margin: 0px 20px 20px 20px;
  }
  
  .flex-container2 p {
    color: #36454F;
    flex: 1;
    padding: 20px;
    font-size: 20px;
    margin: 20px;
    font-family: "Caveat", cursive;
    font-optical-sizing: auto;
  }
  
  /* Footer */
  footer {
    background-color: #28282b; /* Black background color */
    color: white; /* White text color */
    padding: 20px; /* Padding inside the footer */
    text-align: center; /* Center-align text */
    font-size: 18px; /* Font size for text */
  }
  
  .fl3 {
      background-color: #FFF5EE;
  }
  
  
  .flags {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          padding: 20px;
      }
      .flag {
          width: 100px;
          height: 60px;
          margin: 10px;
          background-size: contain;
          background-repeat: no-repeat;
      }
      .flag.flag-us {
          background-image: url('https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg');
      }
      .flag.flag-uk {
          background-image: url('https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg');
      }
      .flag.flag-fr {
          background-image: url('../images/flags/Englang.png');
      }
  
  .fl {
    background-color: #343434;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  
  .fl button{
    margin: -10px 0px 20px 0px; /* Add some space between the paragraphs and the button */
    width: 100px;
    height: 40px;
    border-radius: 10px;
    background-color: #ff6347;
    color: white;
    border: 2px solid black;
  }
  
  .fl a{
    color: white;
    text-decoration: none;;
  }
  
  .fl h2 {
    margin: 10px;
    color: white;
  
  }  
  `;
}

 // at module scope, outside of class:
 function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;

  Events.relay(ev, "dark-mode", { checked }); 

 }