import { supabase } from "../supabaseClient"
import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import NavBarMain from "./NavBar";

export default function ProfileDev({ session }) {
    return (
      <div className="vh-100 vw-100" style={{ backgroundColor: '#9de2ff' }}>
        <NavBarMain session={session}></NavBarMain>
        <MDBContainer>
          <MDBRow className="justify-content-left">
            {/* Existing card */}
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-shrink-0">
                      <MDBCardImage
                        style={{ width: '180px', borderRadius: '10px' }}
                        src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp'
                        alt='Generic placeholder image'
                        fluid />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <MDBCardTitle>Danny McLoan</MDBCardTitle>
                      <MDBCardText>Senior Journalist</MDBCardText>
                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                        style={{ backgroundColor: '#efefef' }}>
                        <div>
                          <p className="small text-muted mb-1">Projects</p>
                          <p className="mb-0">41</p>
                        </div>
                        <div className="px-3">
                          <p className="small text-muted mb-1">Hours</p>
                          <p className="mb-0">976</p>
                        </div>
                        <div>
                          <p className="small text-muted mb-1">Rating</p>
                          <p className="mb-0">8.5</p>
                        </div>
                      </div>
                      <div className="d-flex pt-1">
                        <MDBBtn outline className="me-1 flex-grow-1">Chat</MDBBtn>
                        <MDBBtn className="flex-grow-1">Follow</MDBBtn>
                      </div>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            {/* New card to the right */}
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-grow-1 ms-3">
                      <MDBCardTitle>Previous Projects</MDBCardTitle>
                    </div>
                  </div>
                </MDBCardBody>
                <ul>
                    <li>Project #1</li>
                    <li>Project #2</li>
                    <li>Project #3</li>
                    <li>Project #4</li>
                    <li>Project #5</li>
                </ul>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBRow className="justify-content-left">
            <MDBCol md="12" lg="12" xl="12" className="mt-5">
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-grow-1 ms-3">
                      <MDBCardTitle>Bio</MDBCardTitle>
                      <MDBCardText>Here is my bio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet nibh et quam dignissim luctus sed non mi. Fusce sem leo, accumsan non tortor eu, viverra pulvinar magna. Suspendisse efficitur rhoncus luctus. Donec tempus nec mi ultricies iaculis. Fusce non arcu arcu. Proin quis tincidunt nibh. Praesent sit amet ligula tempor, facilisis turpis a, ultrices libero. Integer rhoncus imperdiet justo nec laoreet. Proin eget consequat nulla. Ut ac ex nec odio fringilla tempor. Nullam auctor mi metus, eu fringilla purus scelerisque ac. <br></br><br></br> Aenean non tellus neque. Pellentesque ac ornare diam. Vestibulum varius vel tellus nec lobortis. Maecenas quis molestie massa, at accumsan lacus.  Duis dictum nibh nec sem rhoncus, eu pharetra sapien efficitur. Mauris venenatis interdum ipsum vitae accumsan. Sed vehicula sed nulla a condimentum. Aenean eget convallis leo. Proin auctor nisi neque, nec facilisis leo tincidunt sed. Vivamus aliquet euismod eros elementum iaculis. Suspendisse ut dignissim odio. Cras ut nisl ut nunc mattis egestas quis vitae quam. Nam vitae nunc at nulla consequat semper eu sed felis. Nunc efficitur leo nec nisl commodo, et suscipit ipsum consequat. Praesent sollicitudin accumsan nunc, eu dignissim felis laoreet quis. Nunc ullamcorper risus in ante fringilla pharetra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. </MDBCardText>
                      <p className = "mt-4"> Skills </p>  
                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2">
                        <div>
                          <p className="mb-0 bg-primary rounded-pill p-2">Javascript</p>
                        </div>
                        <div className="px-3">
                          <p className="mb-0 bg-primary rounded-pill p-2">HTML</p>
                        </div>
                        <div>
                          <p className="mb-0 bg-primary rounded-pill p-2" style={{ minWidth: '80px' }}>CSS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
  