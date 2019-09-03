import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {ApiService} from '../shared/api.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {BlogService} from '../shared/blog.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  @Input() isLoggedIn = false;

  newPassword: string;
  newPasswordAgain: string;

  /**
   * dependency for modals inside the application
   */
  modalRef: BsModalRef;

  navbarOpen = false;



  constructor(private auth: AuthService, private api: ApiService,
              private modalService: BsModalService, private toastr: ToastrService) {
    console.log('tokenrefresh');
    this.api.tokenrefresh().subscribe(elem => {
      this.auth.login(elem);
    });
  }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }


  /**
   * opens the modals from the class, here suggestion modal
   * @param {TemplateRef<any>} template
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * closes the modal
   * @param {TemplateRef<any>} template
   */
  closeModal(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.toastr.warning('You changed or saved no data!');
  }


  public logout(): void {
    this.auth.logout();
  }

  public editUser(): void {
    console.log('edit user');
  }

  public changePassword(): void {
    if (this.newPassword === this.newPasswordAgain) {
      const pw = {
        newpw: this.newPassword
      };
      this.api.changeUserPassword(pw).subscribe(elem => {
        console.log(elem);
        this.toastr.success('Password changed!', 'Success');
        this.modalRef.hide();
      });
    } else {
      this.toastr.warning('New Pssswords did not match', 'Warning');
    }
  }

  get token(): any {
    return this.auth.isAuthenticated();
  }

}
