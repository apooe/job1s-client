import {getInstance} from '../../helpers/httpInstance';
import {useState} from "react";
import {withRouter} from "react-router";
import RegisterForm from "./RegisterForm";

const url = '/users';

const RegisterManager = () =>{

    const httpClient = getInstance();
    const [selectedUser, setSelectedUser] = useState({});

    const onChangeUser = (field, value) => {
        setSelectedUser({...selectedUser, [field]: value});
    }

    const emptyForm = () => {
        setSelectedUser({email:'', firstname:'', lastname:'', password:'', confirmPassword:''});
    }

    const handleSubmit = (formToSend) =>{

        console.log(formToSend.email)

        return httpClient.post(url, formToSend).then(response =>{
                const {data} = response;
                console.log(data);

                console.log("SUCCESS !!!");
            }).catch(error => {
                console.log(error.response.data);
            });
    }

    return (
        <div>
            <RegisterForm handleSubmit={handleSubmit} onChangeUser={onChangeUser}></RegisterForm>


        </div>)

}


export default withRouter(RegisterManager);
