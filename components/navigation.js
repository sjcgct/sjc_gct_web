import { Nav, NavDropdown, Navbar, Button, Form, FormControl } from 'react-bootstrap'
import React, { Component } from 'react'
import Link from 'next/link'

class NavBar extends Component {

  render () {


    return (
      <Navbar className='navbar' expand='lg'>
        <Navbar.Brand href='/'>SJC</Navbar.Brand>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />

        <Navbar.Collapse id='basic-navbar-nav'>

          <Nav className='mr-auto'>

            <Link href='/' passHref>
              <Nav.Link>Home</Nav.Link>
            </Link>

            <Link href='/news' passHref>
              <Nav.Link>Campus News</Nav.Link>
            </Link>

            <NavDropdown title='Blog' id='basic-nav-dropdown'>

              <Link href='/blog' passHref>
                <NavDropdown.Item>All</NavDropdown.Item>
              </Link>


              <Link href='/openpage' passHref>
                <NavDropdown.Item>Open Page</NavDropdown.Item>
              </Link>

              <Link href='/celluloid' passHref>
                <NavDropdown.Item>Celluloid</NavDropdown.Item>
              </Link>

              <Link href='/scitech' passHref>
                <NavDropdown.Item>SciTech</NavDropdown.Item>
              </Link>

              <Link href='/alumspace' passHref>
                <NavDropdown.Item>AlumSpace</NavDropdown.Item>
              </Link>

              <Link href='/tete-a-tete' passHref>
                <NavDropdown.Item>Tete-a-Tete with Interns</NavDropdown.Item>
              </Link>

            </NavDropdown>

            <Link href='/hog' passHref>
              <Nav.Link>Humans of GCT</Nav.Link>
            </Link>

            <Link href='/aperture' passHref>
              <Nav.Link>Aperture Newsletter</Nav.Link>
            </Link>

            <Link href='/podcast' passHref>
              <Nav.Link>Podcast</Nav.Link>
            </Link>

            <Nav.Link href='https://www.youtube.com/ApertureBroadcastingChannelGCT'>ABC Channel</Nav.Link>

            <Link href='/about' passHref>
              <Nav.Link>About</Nav.Link>
            </Link>

          </Nav>

          <Form inline>
            <FormControl type='text' placeholder='Search' className='mr-sm-2' />
            <Button variant='outline-success'>Search</Button>
          </Form>

        </Navbar.Collapse>

      </Navbar>
    )
  }
}

export default NavBar
