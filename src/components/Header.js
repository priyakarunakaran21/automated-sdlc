import './style.scss';
import icon_call from '../assets/images/call.svg';
import icon_logo from '../assets/images/logo.png';

const Header = () =>{
    return(
        <header>
            <div className="hcontainer">
            <a href="#" className="logo"><img src={icon_logo} alt=""/></a>
            <a href="#" className="support-link"><img src={icon_call} alt=""/>Help / Support</a>
            </div>
        </header>
    )
}
export default Header;