import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"

export const Dashboard = () => {
    return(
        <div className="m-10 p-8 bg-gray-200 border rounded-lg">
            <Appbar/>
            <Balance value={1000}/>
            <Users/>
        </div>
    )
}