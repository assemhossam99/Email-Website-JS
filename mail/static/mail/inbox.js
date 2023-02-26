document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox'); 
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose-button').disabled = true;  


  document.querySelector('#compose-form').onkeyup = () =>{
    if(document.querySelector('#compose-recipients').value.length == 0 
    || document.querySelector('#compose-subject').value.length == 0
    || document.querySelector('#compose-body').value.length == 0){
      document.querySelector('#compose-button').disabled = true;
    } else{
      document.querySelector('#compose-button').disabled = false;
    }
  }
  document.querySelector('#compose-form').onsubmit = ()=>{
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    for(let i = 0; i < emails.length; i++){
      let email = emails[i];
      const element = document.createElement('div');
      const senderElement = document.createElement('div');
      senderElement.innerHTML = email.sender;
      senderElement.style.fontWeight = 'bold';
      senderElement.style.float = 'left';
      senderElement.style.paddingRight = '20px';

      const subjectElement = document.createElement('div');
      subjectElement.innerHTML = email.subject;

      element.appendChild(senderElement);
      element.appendChild(subjectElement);
      element.style.border = 'solid';
      element.style.padding = '10px'; 
      element.style.margin = '5px';
      document.querySelector('#emails-view').append(element);
    }
});
}