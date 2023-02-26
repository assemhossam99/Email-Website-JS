document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox'); 
  return false;
});

function css(element, style){
  for (const property in style)
        element.style[property] = style[property];
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';

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

function addEmailElement(email, element){
  const senderElement = document.createElement('span');
      senderElement.innerHTML = email.sender;
      css(senderElement, {
        'font-weight': 'bold',
        'float': 'left',
        'padding-right' : '10px',
        'font-size': 'large'
      })

      const subjectElement = document.createElement('span');
      subjectElement.innerHTML = email.subject;

      const timeStamp = document.createElement('span');
      timeStamp.innerHTML = email.timestamp;
      css(timeStamp, {
        'color' : 'gray',
        'float': 'right'
      })

      element.appendChild(senderElement);
      element.appendChild(subjectElement);
      element.appendChild(timeStamp);
      css(element, {
        'border': 'solid',
        'padding': '10px',
        'margin': '10px'
      })
      if(email.read == false){
        element.style.backgroundColor = 'lightgray';
      }
      document.querySelector('#emails-view').append(element);
      
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';

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
      addEmailElement(email, element);
      element.addEventListener('click', ()=>{
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
        load_mail(email);
      })
    }
    
});
}

function appendChiledElement(email, element, newElement, key, value){
  newElement.innerHTML = key + ': ' + value;
  element.appendChild(newElement);
}

function addMailContent(email, element){
  const senderElement = document.createElement('div');
  appendChiledElement(email, element, senderElement, 'Sender', email.sender);

  const recipientsElement = document.createElement('div');
  appendChiledElement(email, element, recipientsElement, 'Recipients',  email.recipients);

  const subjectElement = document.createElement('div');
  appendChiledElement(email, element, subjectElement, 'Subject: ', email.subject);

  const bodyElement = document.createElement('div');
  appendChiledElement(email, element, bodyElement, 'Body', email.body);
}

function load_mail(email){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'block';
  document.querySelector('#mail-view').innerHTML = '';
  
  const mailElement = document.createElement('div');
  
  addMailContent(email, mailElement);
  css(mailElement, {
    'border' : 'solid',
    'border-weight' : '1px'
  })
  document.querySelector('#mail-view').append(mailElement);
}