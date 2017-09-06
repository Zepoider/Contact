//Объявление общедоступных переменных
let ContactsArray = [];
let Contact;
let createNewContact = true;
let SearchArray = [];
//Блок событий при отображении списка контактов
document.getElementById('add-contact-button').addEventListener('click', AddNewContact, false);
let inputSearch = document.getElementById('inputsearch');
inputSearch.oninput = function () {

    SearchArray.length = 0;

    let matchValue = /^[a-zA-Z\s]*$/;
    if (!inputSearch.value.match(matchValue) || inputSearch.value.length > 22)
    {
        inputSearch.value = inputSearch.value.substr(0, inputSearch.value.length - 1);
    }

    for (let i = 0; i < ContactsArray.length; i++)
    {
        if (ContactsArray[i].name.toLowerCase().indexOf(inputSearch.value.toLowerCase()) ==  0 )
        {
            SearchArray.push(ContactsArray[i]);
        }
    }
    ReloadContactList(SearchArray);
}
document.getElementById('contact-list').onclick = function (event){
    let target = event.target || event.srcElement
    if (target.id != 'contact-list') {
        if (target.id != '')EditContact(target.id);
    }
    }
document.getElementById('add-contact').onclick = function (event){
    let target = event.target || event.srcElement

    if (target.className == 'button-plus-phone'){
        AddNumber();
    }
    if (target.className == 'button-minus-phone'){
        RemoveNumber(target);
    }
    if (target.className == 'button-plus-email'){
        AddMail();
    }
    if (target.className == 'button-minus-email'){
        RemoveMail(target);
    }
}
//Подтягивание базы контактов при первом запуске/релоаде
    if (localStorage.getItem('Contacts'))
    {
        ContactsArray = JSON.parse(localStorage.getItem('Contacts'));
        ReloadContactList(ContactsArray);
    }
//Логика добаления и редактирования контакта
function AddNewContact() {
    createNewContact = true;
    let newContact = {
        id: 0,
        name: '',
        number: [''],
        email: ['']
    }

    OpenContactWindow(newContact);
}
function RemoveContact() {
    ContactsArray.splice(Contact.id, 1);
    localStorage.setItem('Contacts', JSON.stringify(ContactsArray));
    CloseContactWindow();
    ReloadContactList(ContactsArray);
}
function EditContact(id) {
    for (let i = 0; i < ContactsArray.length; i++){
        if (ContactsArray[i].id == id){
            Contact = ContactsArray[i];
            createNewContact = false;
            OpenContactWindow(Contact);
            break;
        }
    }
}
function SaveContact() {

    let inputName = document.getElementById('name');
    let numberId0 = document.getElementById('number0');
    let emailId0 = document.getElementById('email0');

    SaveInputValue();

        if(inputName.value != '' && numberId0.value != '' && emailId0.value != '')
        {

            for (let i = 0; i < Contact.number.length; i++){
                if (Contact.number[i] == '')
                {
                    Contact.number.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < Contact.email.length; i++){
                if (Contact.email[i] == '')
                {
                    Contact.email.splice(i, 1);
                    i--;
                }
            }
    if (createNewContact) {
        ContactsArray.push(Contact);
    }

    ReloadContactList(ContactsArray)
    localStorage.setItem('Contacts', JSON.stringify(ContactsArray));

    CloseContactWindow();
        }
        else {
    if (numberId0.value == ''){
        numberId0.setAttribute('placeholder', 'Enter phone number');
    }
    if (emailId0.value == '') {
        emailId0.setAttribute('placeholder', 'Enter e-mail address')
    }
    if (inputName.value == ''){
        inputName.setAttribute('placeholder', 'Enter contact name')
    }
}
}
function SaveInputValue() {
    let inputName = document.getElementById('name');
    Contact.name = inputName.value;
    for(let z = 0; z < Contact.number.length; z++){
        let numberId = document.getElementById('number'+z);
        if (numberId != null)Contact.number[z] = numberId.value;
    }
    for(let y = 0; y < Contact.email.length; y++){
        let emailId = document.getElementById('email'+y);
        if (emailId != null)Contact.email[y] = emailId.value;
    }
}
//Логика переключения между списком контактов и формой добавления/редактирования контакта
function OpenContactWindow(contact) {

    Contact = contact;
    document.getElementById('contact-list').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.getElementById('add-contact').style.display = 'flex';
    AddContactDrow();

    document.getElementById('save-contact').addEventListener('click', SaveContact, false);
    document.getElementById('reset-change').addEventListener('click', CloseContactWindow, false);
    if (!createNewContact) document.getElementById('removecontact').addEventListener('click', RemoveContact, false);

}
function CloseContactWindow() {
    document.getElementById('contact-list').style.display = 'flex';
    document.getElementById('header').style.display = 'flex';
    document.getElementById('add-contact').style.display = 'none';
    ContactsArray = JSON.parse(localStorage.getItem('Contacts'));

    ResetAddContactWindow();
    ReloadContactList(ContactsArray);
}
function ResetAddContactWindow() {
    SaveInputValue();
    let inputClean = document.getElementsByTagName('input');
    for (let i = 0; i < inputClean.length; i++){
        inputClean[i].value = '';
    }

    let addContact = document.getElementById('add-contact');
    while (addContact.firstChild){
        addContact.removeChild(addContact.firstChild);
    }
}
function ReloadContactList(currentArray) {
    let contactList = document.getElementById('contact-list');
    while (contactList.firstChild){
        contactList.removeChild(contactList.firstChild);
    }
    currentArray.sort(function (x, y) {
        if (x.name > y.name)
            return 1;
        if (x.name < y.name)
            return -1;
        return 0;
    });

    if (currentArray != ContactsArray) {
        for (let i = 0; i < currentArray.length; i++) {
            ContactListDraw(currentArray[i]);
        }
    } else {
        for (let i = 0; i < ContactsArray.length; i++) {
            ContactsArray[i].id = i;
            ContactListDraw(currentArray[i]);
        }
    }
}
//Отрисовка формы добавления и редактирования контакта
function AddContactDrow() {

    let contactForm = document.getElementById('add-contact');

    let headerDiv = document.createElement('div');
    headerDiv.setAttribute('class', 'text');
    contactForm.appendChild(headerDiv);
    let headerH = document.createElement('h2');
    if (createNewContact) {
        headerH.innerText = 'Add Contact';
    }else {
        headerH.innerText = 'Edit Contact';
        let removeContact = document.createElement('div');
        removeContact.setAttribute('id', 'removecontact');
        removeContact.innerText = 'Remove Contact';
        contactForm.appendChild(removeContact);
    }
    headerDiv.appendChild(headerH);


    for (element in Contact) {
        if (element == 'name') {
            let nameDiv = document.createElement('div');
            nameDiv.setAttribute('class', 'search');
            contactForm.appendChild(nameDiv);

            let nameSpan = document.createElement('span');
            nameSpan.innerText = 'Name';
            nameDiv.appendChild(nameSpan);
            let nameInput = document.createElement('input');
            nameInput.setAttribute('type', 'text');
            nameInput.setAttribute('id', 'name');
            nameDiv.appendChild(nameInput);
            nameInput.value = Contact.name;
            nameInput.oninput = function ()
            {
                let matchValue = /^[a-zA-Z\s]*$/;
                if (!nameInput.value.match(matchValue) || nameInput.value.length > 22)
                {
                    nameInput.value = nameInput.value.substr(0, nameInput.value.length - 1);
                }
            }
        }
        if (element == 'number') {
            for (let l = 0; l < Contact.number.length; l++) {
                let phoneDiv = document.createElement('div');
                phoneDiv.setAttribute('class', 'search plus-minus-fields');
                phoneDiv.setAttribute('id', 'phone-number-div');
                contactForm.appendChild(phoneDiv);

                let minusDiv = document.createElement('div');
                minusDiv.setAttribute('class', 'button-minus-phone');
                minusDiv.innerText = '-';
                minusDiv.setAttribute('id', l);
                phoneDiv.appendChild(minusDiv);

                let phoneDivEmpty = document.createElement('div');
                phoneDiv.appendChild(phoneDivEmpty);

                let phoneSpan = document.createElement('span');
                phoneSpan.innerText = 'Phone Number';
                phoneDivEmpty.appendChild(phoneSpan);
                let phoneInput = document.createElement('input');
                phoneInput.setAttribute('type', 'text');
                phoneInput.setAttribute('id', 'number'+l);
                phoneDivEmpty.appendChild(phoneInput);
                phoneInput.oninput = function ()
                {
                    if (isNaN(phoneInput.value+1) || phoneInput.value.length > 10)
                    {
                        phoneInput.value = phoneInput.value.substr(0, phoneInput.value.length - 1);
                    }
                }

                let plusDiv = document.createElement('div');
                plusDiv.setAttribute('class', 'button-plus-phone');
                plusDiv.innerText = '+';
                phoneDiv.appendChild(plusDiv);

                phoneInput.value = Contact.number[l];
            }
        }
        if (element == 'email') {
            for (let h = 0; h < Contact.email.length; h++) {
                let emailDiv = document.createElement('div');
                emailDiv.setAttribute('class', 'search plus-minus-fields');
                emailDiv.setAttribute('id', 'email-div');
                contactForm.appendChild(emailDiv);

                let minusDiv = document.createElement('div');
                minusDiv.setAttribute('class', 'button-minus-email');
                minusDiv.innerText = '-';
                minusDiv.setAttribute('id', h);
                emailDiv.appendChild(minusDiv);

                let emailDivEmpty = document.createElement('div');
                emailDiv.appendChild(emailDivEmpty);

                let emailSpan = document.createElement('span');
                emailSpan.innerText = 'E-mail Address';

                emailDivEmpty.appendChild(emailSpan);
                let emailInput = document.createElement('input');
                emailInput.setAttribute('type', 'text');
                emailInput.setAttribute('id', 'email'+h);
                emailDivEmpty.appendChild(emailInput);
                emailInput.oninput = function ()
                {
                    let matchValue = /^[a-z0-9@._]*$/;
                    if (!emailInput.value.match(matchValue) || emailInput.value.length > 25)
                    {
                        emailInput.value = emailInput.value.substr(0, emailInput.value.length - 1);
                    }
                }

                let plusDiv = document.createElement('div');
                plusDiv.setAttribute('class', 'button-plus-email');
                plusDiv.innerText = '+';
                emailDiv.appendChild(plusDiv);

                emailInput.value = Contact.email[h];
            }
        }
    }

    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'search buttons');
    contactForm.appendChild(buttonDiv);

    let buttonOkDiv = document.createElement('div');
    buttonOkDiv.setAttribute('id', 'save-contact');
    buttonOkDiv.innerText = 'Ok';
    buttonDiv.appendChild(buttonOkDiv);

    let buttonCancelDiv = document.createElement('div');
    buttonCancelDiv.setAttribute('id', 'reset-change');
    buttonCancelDiv.innerText = 'Cancel';
    buttonDiv.appendChild(buttonCancelDiv);
}
function RemoveNumber(element) {
    if (element.id != 0){
        let removeElementParent = element.parentElement;
        let removeElement = removeElementParent.parentElement;
        removeElement.removeChild(removeElementParent);
        Contact.number.splice(element.id, 1);
        ResetAddContactWindow();
        OpenContactWindow(Contact);
    }
}
function AddNumber() {
    Contact.number[Contact.number.length] = '';
    ResetAddContactWindow();
    OpenContactWindow(Contact);
}
function RemoveMail(element) {
    if (element.id != 0) {
        let removeElementParent = element.parentElement;
        let removeElement = removeElementParent.parentElement;
        removeElement.removeChild(removeElementParent);
        Contact.email.splice(element.id, 1);
    }
}
function AddMail() {
    Contact.email[Contact.email.length] = '';
    ResetAddContactWindow();
    OpenContactWindow(Contact);
}
//Отрисовка списка контактов
function ContactListDraw(contact) {

    let contactList = document.getElementById('contact-list');

    let listDiv = document.createElement("div");
    listDiv.setAttribute('class', 'list');
    contactList.appendChild(listDiv);

    let logoDiv = document.createElement("div");
    logoDiv.setAttribute('class', 'logo');
    logoDiv.setAttribute('id', contact.id);
    listDiv.appendChild(logoDiv);
    let logoSpan = document.createElement('span');
    logoSpan.setAttribute('class', 'logospan');
    logoSpan.setAttribute('id', contact.id);
    logoDiv.appendChild(logoSpan);
    logoSpan.innerText ='Z';

    let contactdataDiv = document.createElement("div");
    contactdataDiv.setAttribute('class', 'contactdata');
    listDiv.appendChild(contactdataDiv);

for (element in contact){
    if (element == 'name') CreateName(contactdataDiv, contact);
    if (element == 'number')
    {
       // for (let j = 0; j < contact.number.length; j++) {
            CreateNumber(contactdataDiv, contact.number[0]);
      //  }
    }
    if (element == 'email')
    {
      //  for (let k = 0; k < contact.email.length; k++) {
            CreateEmail(contactdataDiv, contact.email[0]);
    //    }
    }
}

}
function CreateName(Div, contact) {
    let nameDiv = document.createElement("div");
    nameDiv.setAttribute('class', 'name');
    Div.appendChild(nameDiv);
    nameDiv.innerText = contact.name;
}
function CreateNumber(Div, contact) {
    let phoneDiv = document.createElement("div");
    phoneDiv.setAttribute('class', 'phone');
    Div.appendChild(phoneDiv);
    phoneDiv.innerText = contact;
}
function CreateEmail(Div,contact) {
    let emailDiv = document.createElement("div");
    emailDiv.setAttribute('class', 'email');
    Div.appendChild(emailDiv);
    emailDiv.innerText = contact;
}