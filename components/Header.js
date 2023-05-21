// components/Header.js


import styles from './Header.module.css';

function Header() {
    return (
        <div className={styles.chatHeader}>
            <img src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d4c7f49bf4234c6a5a7e_AIfred.svg" alt="AIfred" style={{ height: '50px', marginTop: '5px'  }} />

        </div>
    );
}

export default Header;
