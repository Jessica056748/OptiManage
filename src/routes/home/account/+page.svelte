<script lang="ts">
    import { json, text } from "@sveltejs/kit";
    import { preventDefault } from "svelte/legacy";
 </script>
 <h1>Personal Information </h1>

<form>
<div id = div1>
<br>
    <label for = "fname">First name :</label> 
    <input id = "fname" type = "text" disabled>
    <script> fetch (`http://localhost:5000/add-employee'`)
        .then (Response => response.json())
        .then (data => {
            document.getElementbyID ("fname").value = data.name;
        })
        .catch (error) {
      console.error(error)
      return 
    }
    </script>
<br>
<br>
    <label for = "lname">Last Name: </label>
    <input id = "lname" type = "text" disabled>
    <script> fetch (`http://localhost:5000/add-employee'`)
        .then (Response => response.json())
        .then (data => {
            document.getElementbyID ("lname").value = data.message;
        })
        .catch (error) {
      console.error(error)
      return 
    }
    </script>
<br>

<br>
    <label for = "SIN"> SIN: </label>
    <input id = "SIN" type = "text" disabled>
    
<br>

<br>
    <label for = "email">Email: </label>
    <input id = "email" type ="email" disabled>
<br>

<br>
    <label for = "phone"> Phone number: </label>
    <input id = "phone" type = "tel" >
<br>

<br>
    <label for = "address"> Address: </label>
    <input id = "address" type = "text" >
<br>

<br>
    <label for = "password"> Password: </label>
    <input id = "password" type = "password" >
<br>

<br>
    <label for = "departmentID"> Department ID: </label>
    <input id = "departmentID" type = "Text" disabled >
<br>

<br>
    <label for = "rate"> Rate: </label>
    <input id = "rate" type = "text" disabled >
<br>
</div>

<div id = div2>
<br>
<input id = "submit" type = "button" name = "Submit" value = "Submit">
<br>
</div>

</form>

<!-- <script>
    const form = document.querySelector(".form");
    form.addEventListener('submit', event =>{
        event.preventDefault();

        const FData = new FormData(form);
        
        

    })
</script> -->

<!-- HTML -->

<style>
h1{text-align:center}
#div1 {
    position:bottom;
    left: 30 px;
    width: 600px;
    padding: 0px;
    text-align:right;
}
#div2{
    text-align:center;
}
</style>
