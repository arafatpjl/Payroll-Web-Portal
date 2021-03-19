using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using PacificPortal.Models;
using System.Data;
using System.Net.Mail;
using System.Net;
using System.Data.Entity.Validation;
using System.Drawing;
using Newtonsoft.Json;

namespace PacificPortal.Controllers
{
    public class UserController : Controller
    {
       
       //Registration form saving code
        [HttpPost]
        public JsonResult Login_check(tblUser_Registration u)
        {
            string message = "";
           

            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var user = dc.tblUser_Registration.Where(a => a.RegId.Equals(u.RegId) & a.YsnActive == true).FirstOrDefault();

                    if (user != null)
                    {

                        //string pass=Utilities.Decrypt(user.Password.Trim());
                        if (u.Password.Trim() == Utilities.Decrypt(user.Password.Trim()))
                        {


                            System.Web.HttpContext.Current.Session["LoginID"] = user.RegId;
                            System.Web.HttpContext.Current.Session["UserDetail"] = System.Web.HttpContext.Current.Session["EmpDetail"];

                            
                            //Get Menus

                            List<UserMenu> UserMenu = new List<UserMenu>();
                            UserMenu = dc.Database.SqlQuery<UserMenu>("exec prc_UserMenu  {0}", user.RegId).ToList();
                            System.Web.HttpContext.Current.Session["UserMenu"] = UserMenu;


                            //Get Team Member List In session
                            DataController DataController = new DataController();
                            DataController.GetTeamMember(user.RegId.ToString());


                            message = "Success";

                        }
                        else
                        {
                            message =  "Password Not Match";

                        }  
                    }
                    else
                    {
                        message = " Username not available!";
                    }
                }
            }
            else
            {
                message = "Failed!";
            }
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }




        //Registration form saving code
        [HttpPost]
        public JsonResult RecoveryPassword(tblUser_Registration u)
        {
            string message = "";


            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var user = dc.tblUser_Registration.Where(a => a.RegId.Equals(u.RegId) & a.DateofBirth.Value.Month == u.DateofBirth.Value.Month & a.DateofBirth.Value.Day == u.DateofBirth.Value.Day & a.DateofBirth.Value.Year == u.DateofBirth.Value.Year & a.YsnActive == true).FirstOrDefault();

                    if (user != null)
                    {

                        const string alphanumericCharacters =
                                        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                                        "abcdefghijklmnopqrstuvwxyz" +
                                        "0123456789";

                        string tmp_password = Utilities.GetRandomString(5, alphanumericCharacters);


                        EmailModel model = new EmailModel();

                        model.To = user.EmailID;
                        model.Subject = "Recovery Password : " +u.Updated_by +" - "+ user.MobileNoPerson;
                        //model.Body = u.Updated_by + " - " + user.MobileNoPerson + ",Your temporary Password is : " + tmp_password;
                        model.Body = @" <img id=""1"" src=""cid:pjl_HRIS.png""> <br/><br/><br/>" + u.Updated_by + " - " + user.MobileNoPerson + ",Your temporary Password is : " + " <font color=#336699>" + tmp_password + "</font>";

                        message = Utilities.SendMail(model, "Recovery Password").Data.ToString();

                        user.Password = Utilities.Encrypt(tmp_password.Trim());

                        user.Updated_by = Request.UserHostName  ;
                        user.Updated_date = DateTime.Now;


                        dc.SaveChanges();

                        //message = "Success";

                       
                    }
                    else
                    {
                        message = " Wrong Recovery Information!";
                    }
                }
            }
            else
            {
                message = "Failed!";
            }
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }




      [HttpPost]
        public JsonResult Register_update(tblUser_Registration u)
        {
            string message = "";


            int RegId = int.Parse(Session["LoginID"].ToString());

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();
           

            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {
                    //check username available
                    //var user = dc.tblUserRegistrations.FirstOrDefault();
                    if (u != null)
                    {
                      //  var employeeDetails = dc.tblUser_Registration.Where(x => x.EmployeeCode == u.EmployeeCode & x.ComID == u.ComID).FirstOrDefault();

                        var employeeDetails = dc.tblUser_Registration.Where(x => x.RegId == RegId).FirstOrDefault();

                        // employeeDetails.ComID = u.ComID;
                        employeeDetails.DateofBirth = u.DateofBirth;
                        employeeDetails.BloodGroup = u.BloodGroup;
                        employeeDetails.DeptHead = u.DeptHead;
                        employeeDetails.ReportSuper = u.ReportSuper;
                        employeeDetails.MobileNoPerson = u.MobileNoPerson;
                        employeeDetails.PhoneExt = u.PhoneExt;
                        employeeDetails.EmailID = u.EmailID;
                        employeeDetails.Password = Utilities.Encrypt(u.Password.Trim());                   
                       
                        employeeDetails.Updated_by = Request.UserHostName  ;
                        employeeDetails.Updated_date = DateTime.Now;
                        dc.SaveChanges();
                        message = "Success";
                    }
                    else
                    {
                        message = "Username not available!";
                    }
                }
            }
            else
            {
                message = "Failed!";
            }
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        // for insert 
      public JsonResult Register_insert(tblUser_Registration u)
      {
          string message = "";
          if (ModelState.IsValid)
          {
              using (Entities dc = new Entities())
              {
                  //check username available
                  //var user = dc.tblUserRegistrations.FirstOrDefault();

                  var user = dc.tblUser_Registration.Where(a => a.RegId.Equals(u.RegId)).FirstOrDefault();

                if (user != null)
                {
                    message = "Already Registerd";

                }
                else
                {
                    if (u != null)
                    {
                        u.Password = Utilities.Encrypt(u.Password);
                      

                        //u.Created_By =  Request.ServerVariables["REMOTE_ADDR"];
                        //u.Created_By = Request.ServerVariables["REMOTE_HOST"];
                        //u.Created_By = Request.ServerVariables["REMOTE_USER"];

                        u.Role = "1";
                        u.Created_By = Request.UserHostName ; 
                        u.Created_date = DateTime.Now;

                        dc.tblUser_Registration.Add(u);
                       

                        try
                        {
                            dc.SaveChanges();
                        }
                        catch (DbEntityValidationException ex)
                        {
                            string errorMessages = string.Join("; ", ex.EntityValidationErrors.SelectMany(x => x.ValidationErrors).Select(x => x.ErrorMessage));
                            throw new DbEntityValidationException(errorMessages);
                        }

                        message = "Success";
                        //Response.Redirect("Home", true);
                    }
                    else
                    {
                        message = "Registration Failed!";
                    }
                }
              }
          }
          else
          {
              message = "Validation Failed!";
          }
          return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
      }




      // Save Login Info

      public JsonResult SaveLoginInfo(tblUser_LogInfo u)
      {
          string message = "";
          int RegId = int.Parse(System.Web.HttpContext.Current.Session["LoginID"].ToString());

          using (Entities dc = new Entities())
          {

              if (u != null)
              {
                  u.RegId = RegId;
                  u.login_time = DateTime.Now;

                  //u.login_Mac =  Request.ServerVariables["REMOTE_ADDR"];
                  //u.login_Mac = Request.ServerVariables["REMOTE_HOST"];
                  //u.login_Mac = Request.ServerVariables["REMOTE_USER"];

                  u.login_Mac = System.Web.HttpContext.Current.Request.UserHostAddress;
                  u.login_Mac = System.Web.HttpContext.Current.Request.UserHostName;

                  dc.tblUser_LogInfo.Add(u);


                  try
                  {
                      dc.SaveChanges();
                  }
                  catch (DbEntityValidationException ex)
                  {
                      string errorMessages = string.Join("; ", ex.EntityValidationErrors.SelectMany(x => x.ValidationErrors).Select(x => x.ErrorMessage));
                      throw new DbEntityValidationException(errorMessages);
                  }

                  message = "Success";
                  //Response.Redirect("Home", true);
              }
              else
              {
                  message = "Registration Failed!";
              }
          }


          return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
      }






      public JsonResult FileUpload(prc_EmployeeInfo_Result user)
      {
          string message = "";

          try
          {

              HttpPostedFileBase file = null;

              if (Request.Files.Count > 0)
              {
                  file = Request.Files[0];
              }


              if (file != null)
              {
                  //string Image_name = System.IO.Path.GetFileName(file.FileName);

                  string RegId = Session["LoginID"].ToString();

                  string Image_name = RegId + ".png";

                  string path = System.IO.Path.Combine(
                                         Server.MapPath("~/images/users"), Image_name);



                  // file is uploaded
                  //file.SaveAs(path);


                  //Image imgOriginal = Image.FromFile(path);

                  Image imgOriginal = Image.FromStream(file.InputStream, true, true);


                  //pass in whatever value you want
                  Image imgActual = Utilities.Scale(imgOriginal, 256, 256);
                  imgOriginal.Dispose();

                  imgActual.Save(path);
                  imgActual.Dispose();


                  //// save the image path path to the database or you can send image 
                  //// directly to database
                  //// in-case if you want to store byte[] ie. for DB
                  //using (MemoryStream ms = new MemoryStream())
                  //{
                  //    file.InputStream.CopyTo(ms);
                  //    byte[] array = ms.GetBuffer();
                  //}


                  message = "Image Updated";
              }



          }


        catch(Exception ex)
          {
              message = ex.ToString();
          }

          return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

      }


      public JsonResult ReportSupperChangeMail(tblUser_Registration user)
        {
            string message = "";


            using (Entities dc = new Entities())
            {
                if (user != null)
                        {



                            // send email to team Leader //ReportSupper

                            try
                            {
                                EmailModel model = new EmailModel();


                                DataController DataController_ = new DataController();




                                JsonResult jsonRequestTo = DataController_.GetRegistrationDetailByRegId(user.ReportSuper.ToString());
                                var json = JsonConvert.SerializeObject(jsonRequestTo.Data);
                                List<tblUser_Registration> RequestTo = JsonConvert.DeserializeObject<List<tblUser_Registration>>(json);

                                List<prc_EmployeeInfo_Result> UserDetail = new List<prc_EmployeeInfo_Result>();
                                UserDetail = (List<prc_EmployeeInfo_Result>)Session["UserDetail"];


                                // newReportSuper
                                JsonResult UsernewReportSuper = DataController_.GetEmployeeDetailByRegId(user.Updated_by.ToString());
                                var jsonnewReportSuper = JsonConvert.SerializeObject(UsernewReportSuper.Data);
                                List<prc_EmployeeInfo_Result> ReportSuperDetail = JsonConvert.DeserializeObject<List<prc_EmployeeInfo_Result>>(jsonnewReportSuper);


                               
                              

                                //JsonResult jsonUserDetail = DataController_.GetUserDetailBySession();

                                //var UserDetail = jsonUserDetail.Data as EmployeeDetail;



                              //  model.FromName = RequestTo[0].Name;
                               // model.FromEmail = RequestTo[0].EmailID;

                                model.FromEmail = "HRIS";
                                model.FromEmail = "HRIS@pacificjeans.com";


                                //model.To = "linkonb@pacificjeans.com";
                                model.To = RequestTo[0].EmailID;
                                //model.To = "linkonb@pacificjeans.com";
                                //model.Subject = "Leave Application of " + UserDetail[0].Name;

                                model.Subject = UserDetail[0].Name + "#" + UserDetail[0].EmployeeCode + " Updated his/her Reporting Boss ";

                                model.Body = @"<table>
                                    <tr>
                                          
                                <img id=""1"" src=""cid:pjl_HRIS.png"">

                                    </tr>
                                    <tr>
                                          <p><b>Dear Sir/Madam, </b></p>
                            
                                    <p>Your team member <b>" + UserDetail[0].Name + " # </b>" + UserDetail[0].EmployeeCode
                                                                                            + " Updated his/her Reporting Boss. <br/>" +

                                    "<br/> His/Her new Reporting Boss is <b>" + Utilities.ToTitleCase(ReportSuperDetail[0].Name.ToLower()) + @"</b>
                                                # " + Utilities.ToTitleCase(ReportSuperDetail[0].EmployeeCode.ToLower()) + @"
                                    >" + Utilities.ToTitleCase(ReportSuperDetail[0].Designation.ToLower()) + @"
                                    > " + Utilities.ToTitleCase(ReportSuperDetail[0].Section.ToLower()) + @"
                                   > " + ReportSuperDetail[0].Department.ToLower() + @" <br/><br/><br/>

                                                Yours faithfully <br/>                           
                                                   HRIS 
                                    </p>


                                    </tr>

                                <tr>


                                        
                                    </tr>

                                   
                            </table>";




                                message = Utilities.SendMail(model,"Leave").Data.ToString();

                            }

                            catch
                            { 
                            
                            }

                        }
                        else
                        {
                            message = "Application Failed!";
                        }
                    
            }

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

    




    }
}
