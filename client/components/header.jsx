import Link from 'next/link'
import Image from 'next/image'
import {useRef} from 'react'
import colors from '../assets/colors'

const Header = ({currentUser}) => {
    const links = [
        !currentUser && {label:'Sign Up', href: '/auth/signup'},
        !currentUser && {label:'Sign In', href: '/auth/signin'},
        currentUser && {label:'Sign Out', href: '/auth/signout'}
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href}) => (
            <li key={href} className='nav-item'>
                <Link href={href}>
                    <a className='nav-link'>{label}</a>
                </Link>
            </li>
        ))

    const menu = useRef()
    function toggleMenu(){
        if(menu.current.classList.contains('d-none')){
            menu.current.classList.remove('d-none')
        } else {
            menu.current.classList.add('d-none')
        }
    }
    function closeMenu() {
        menu.current.classList.add('d-none')
    }
    const s = {
        contacts: {
            color: colors.yellow,
            fontSize: '14px',
            // marginLeft: '20px'
        },
        wrapper: {
            background: '#48357C',
            // height: '130px',
            width: '100%'
        }
    }
    return (
        <div style={s.wrapper}>
            <div className='container d-flex justify-content-between flex-column flex-lg-row'>
                <div className='d-flex justify-content-between'>
                    <div className='d-flex'>
                        <div className='d-none d-lg-flex'>
                            <Image  src="/imgs/logo.png" alt="me" width="200" height="120" />
                        </div>
                        <div  style={{background:colors.yellow, padding: '5px', marginLeft:'-12px'}} className='d-flex d-lg-none' >
                            <Image src="/imgs/logo-bird-blue.png" priority={true} alt="me" width="60" height="60"/>
                        </div>
                        <div className='h-100 d-flex justify-content-center flex-column p-2 p-lg-3 fs-6 fw-bolder' style={s.contacts}>
                            <span>+7(952)2465072</span>   
                            <span>г. Пушкин, ул. Глинки, д. 1</span>
                        </div>
                    </div>
                    <div style={{position: 'relative'}} className='d-block d-lg-none'>
                        <input id="menu__toggle" type="checkbox" />
                        <label class="menu__btn" for="menu__toggle" onClick={toggleMenu}>
                            <span></span>
                        </label>
                    </div>
                </div>
                <div ref={menu} className='header-menu d-none d-lg-flex align-items-center flex-column flex-lg-row mt-3 mt-lg-0 fs-5' onClick={closeMenu}>
                    <Link href='/auth/signin'>
                        <a className='p-2 mb-lg-0 d-flex'>
                            Направления
                            {/* <Image src="/imgs/signin.png" alt="me" width="27" height="27" /> */}
                        </a>
                    </Link>
                    <Link href='/auth/signin'>
                        <a className='p-2 mb-lg-0 d-flex'>
                            Цены
                            {/* <Image src="/imgs/signin.png" alt="me" width="27" height="27" /> */}
                        </a>
                    </Link>
                    <Link href='/auth/signin'>
                        <a className='p-2 mb-lg-0 d-flex'>
                            Расписание
                            {/* <Image src="/imgs/signin.png" alt="me" width="27" height="27" /> */}
                        </a>
                    </Link>
                    <Link href='/auth/signin'>
                        <a className='p-2 mb-lg-0 d-flex'>
                            Контакты
                            {/* <Image src="/imgs/signin.png" alt="me" width="27" height="27" /> */}
                        </a>
                    </Link>
                    <Link href='/auth/signin'>
                        <a className='p-2 mb-lg-0 d-flex'>
                            Вход
                            {/* <Image src="/imgs/signin.png" alt="me" width="27" height="27" /> */}
                        </a>
                    </Link>
                    <Link href='/auth/signup'>
                        <a className='p-2 mb-3 mb-lg-0 d-flex'>
                            Регистрация
                            {/* <Image src="/imgs/signin.png" alt="me" width="27" height="27" /> */}
                        </a>
                    </Link>
                </div>
            </div>
        </div>
        // <nav className='navbar navbar-dark bg-dark'>
        //     <Link href='/'>
        //         <a href="/"></a>
        //     </Link>
        //     <div className="flex justify-content-end">
        //         <ul className='nav d-flex align-items-center'>
        //             {links}
        //         </ul>
        //     </div>
        // </nav>
    )
}

export default Header