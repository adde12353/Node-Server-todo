Hur man använder sig av API från mig

Det finns egentligen två enpoints varav den ena är 
http://localhost:5006/ och den andra är http://localhost:5006/prodjects (och dynamiskt nummer efter vilken todo du väljer)


För att nå alla produkter
fetch('http://localhost:5006/')
            .then(res=>res.json())
            .then(json=>console.log(json))

För att nå en unik toodo, där 16 i detta fallet blir dynamisk
fetch('http://localhost:5006/projects/16')
            .then(res=>res.json())
            .then(json=>console.log(json))


Lägga till ny todo
Måste va strängar och får bara innehålla & details, när den har blivit skapad kommer complete och id läggas till automatiskt
fetch('http://localhost:5006/',{
            method:"POST",
            body:JSON.stringify(
                {
                    title: 'test product',
                    details: 'test'
                }
            )
        })
            .then(res=>res.json())
            .then(json=>console.log(json))


Uppdatera en todo
Måste va strängar och får bara innehålla & details 
fetch('http://localhost:5006/projects/16',{
            method:"PATCH",
            body:JSON.stringify(
                {
                    title: 'test product',
                    details: 'Test'
                }
            )
        })
            .then(res=>res.json())
            .then(json=>console.log(json))

 Uppdatera en completed till true eller false
fetch('http://localhost:5006/projects/16',{
            method:"PUT",
            body:JSON.stringify(
                {
                    complete : true
                 }
            )
        })
            .then(res=>res.json())
            .then(json=>console.log(json))        
