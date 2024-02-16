let documentContainer = document.querySelector('#documentContainer');

export default function printDocuments() {
   
    documentContainer.innerHTML = '';

    fetch('http://localhost:3000/documents')
        .then(res => res.json())
        .then(data => {
            console.log('documents', data);

            data.forEach(doc => {
                try {
                    const documentElement = document.createElement('div');
                    documentElement.innerHTML = `
                        <h2>${doc.title}</h2>
                        <p>${doc.content}</p>
                        <p>Author: ${doc.authorId}</p>
                        <p>Created: ${doc.createdAt}</p>
                        <hr>
                    `;

                    documentContainer.appendChild(documentElement);
                } catch (error) {
                    console.error('Error creating HTML element:', error);
                }
            });
        })
        .catch(error => console.error('Error fetching documents:', error));
}
