using Newtonsoft.Json;
using PacificPortal.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PacificPortal.Controllers
{
    public class LeaveController : Controller
    {


        //Leave Details
        public JsonResult GetLeaveSummary()
        {
            string RegId = Session["LoginID"].ToString();

            string Year = Request.QueryString["Year"];


            List<LeaveSummary> LeaveSummaryList = new List<LeaveSummary>();

            using (Entities context = new Entities())
            {
                LeaveSummaryList = context.Database.SqlQuery<LeaveSummary>("exec prc_EmployeeLeaveEnjoySummary  {0},{1}", RegId, Year).ToList();
            }

            return new JsonResult { Data = LeaveSummaryList, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        // Fetch LeaveCard
        public ActionResult ShowLeaveCard()
        {
            return RedirectToAction("LeaveController");
        }




        //Leave Status

        public JsonResult GetLeaveApplyStatus()
        {
            string RegId = Session["LoginID"].ToString();

            string Year = (Request.QueryString["Year"]);


            List<prc_EmployeeLeaveStatus_Result> LeaveApplyStatusList = new List<prc_EmployeeLeaveStatus_Result>();

            using (Entities context = new Entities())
            {
                LeaveApplyStatusList = context.Database.SqlQuery<prc_EmployeeLeaveStatus_Result>("exec prc_EmployeeLeaveStatus  {0},{1}", RegId, Year).ToList();
            }

            return new JsonResult { Data = LeaveApplyStatusList, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }



        public JsonResult GetLeaveEnjoyDetail()
        {
            //byte CompID = byte.Parse( Session["CompID"].ToString());

            string RegId = Session["LoginID"].ToString();

            string Year = (Request.QueryString["Year"]);


            List<LeaveEnjoy> LeaveCardDetails = new List<LeaveEnjoy>();

            using (Entities context = new Entities())
            {
                LeaveCardDetails = context.Database.SqlQuery<LeaveEnjoy>("exec prc_EmployeeLeaveEnjoyDetail  {0},{1}", RegId, Year).ToList();
            }
            return new JsonResult { Data = LeaveCardDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }



        public JsonResult GetEmployeeLeaveApproved()
        {
            //byte CompID = byte.Parse( Session["CompID"].ToString());

            string RegId = Session["LoginID"].ToString();

            string Month = (Request.QueryString["Month"]);
            string Year = (Request.QueryString["Year"]);


            List<prc_EmployeeLeaveInfo_Result> EmployeeLeaveInfo = new List<prc_EmployeeLeaveInfo_Result>();

            using (Entities context = new Entities())
            {
                EmployeeLeaveInfo = context.Database.SqlQuery<prc_EmployeeLeaveInfo_Result>("exec prc_EmployeeLeaveInfo  {0},{1}", Month, Year).ToList();
            }
            return new JsonResult { Data = EmployeeLeaveInfo, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }



        //Leave Status
        [HttpPost]
        public JsonResult LeaveApplication(tblEmpLeaveApp EmpLeaveApp)
        {

            string message = "";

              var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();
           //catch (DbEntityValidationException ex)
           //             {
           //                 string errorMessages = string.Join("; ", ex.EntityValidationErrors.SelectMany(x => x.ValidationErrors).Select(x => x.ErrorMessage));
           //                 throw new DbEntityValidationException(errorMessages);
           //             }

              string errors_string = JsonConvert.SerializeObject(ModelState.Values.SelectMany(state => state.Errors).Select(error => error.ErrorMessage));

            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {

                    //string RegId = Session["LoginID"].ToString();

                    //string Year = (Request.QueryString["Year"]);
                 


                    List<ProcedureReturnStatus> LeaveApplyStatusList = new List<ProcedureReturnStatus>();

                    using (Entities context = new Entities())
                    {


                        if (EmpLeaveApp.LDays >= 1)
                        {
                            EmpLeaveApp.LDays = (EmpLeaveApp.ToDate.Date - EmpLeaveApp.FrDate.Date).Days + 1;
                        }
                        else
                        {
                            EmpLeaveApp.ToDate = EmpLeaveApp.FrDate;
                        }




                        LeaveApplyStatusList = context.Database.SqlQuery<ProcedureReturnStatus>(@" exec prc_EmployeeLeaveApplication
                        {0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11}",
                                                    EmpLeaveApp.RegId ,
                                                    EmpLeaveApp.AppliedDate ,
                                                    EmpLeaveApp.RequestTo ,
                                                    EmpLeaveApp.ActingPerson ,
                                                    EmpLeaveApp.LType ,
                                                    EmpLeaveApp.LDays ,
                                                    EmpLeaveApp.FrDate.Date ,
                                                    EmpLeaveApp.ToDate.Date,
                                                    EmpLeaveApp.Reasons ,
                                                    EmpLeaveApp.Status ,
                                                    EmpLeaveApp.Created_date ,
                                                    EmpLeaveApp.Created_By 
                                                    ).ToList();
                    }




                    if (LeaveApplyStatusList[0].Status == false)
                    {
                        message = LeaveApplyStatusList[0].Message.ToString();

                    }
                    else
                    {

                        EmpLeaveApp.Created_By = Request.UserHostName;
                        EmpLeaveApp.Created_date = DateTime.Now;

                        dc.tblEmpLeaveApps.Add(EmpLeaveApp);
                        dc.SaveChanges();
                        message = "Success";
                    }


                    
                }
            }
            else
            {
                message = "Validation Failed!" + errors_string;
            }

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        public JsonResult LeaveApplicationMail(tblEmpLeaveApp EmpLeaveApp)
        {
            string message = "";


            using (Entities dc = new Entities())
            {
                        if (EmpLeaveApp != null)
                        {


                            if (EmpLeaveApp.LDays >= 1)
                            {
                                EmpLeaveApp.LDays = (EmpLeaveApp.ToDate.Date - EmpLeaveApp.FrDate.Date).Days + 1;
                            }

                           
                            // send email to team Leader

                            try
                            {
                                EmailModel model = new EmailModel();


                                DataController DataController_ = new DataController();



                                JsonResult UserReg = DataController_.GetRegistrationDetailByRegId(EmpLeaveApp.RegId.ToString());
                                var jsonUserReg = JsonConvert.SerializeObject(UserReg.Data);
                                List<tblUser_Registration> UserRegDetail = JsonConvert.DeserializeObject<List<tblUser_Registration>>(jsonUserReg);



                                JsonResult jsonRequestTo= DataController_.GetRegistrationDetailByRegId(EmpLeaveApp.RequestTo.ToString());
                                var json = JsonConvert.SerializeObject(jsonRequestTo.Data);
                                List<tblUser_Registration> RequestTo = JsonConvert.DeserializeObject<List<tblUser_Registration>>(json);



                                JsonResult RegDeskLook = DataController_.GetRegistrationDetailByRegId(EmpLeaveApp.ActingPerson.ToString());
                                var jsonUserDeskLook = JsonConvert.SerializeObject(RegDeskLook.Data);
                                List<tblUser_Registration> DeskLook = JsonConvert.DeserializeObject<List<tblUser_Registration>>(jsonUserDeskLook);


                                JsonResult UserDeskLook = DataController_.GetEmployeeDetailByRegId(EmpLeaveApp.ActingPerson.ToString());
                                var jsonUserDeskLookDetail = JsonConvert.SerializeObject(UserDeskLook.Data);
                                List<prc_EmployeeInfo_Result> UserDeskLookDetail = JsonConvert.DeserializeObject<List<prc_EmployeeInfo_Result>>(jsonUserDeskLookDetail);



                                List<prc_EmployeeInfo_Result> UserDetail = new List<prc_EmployeeInfo_Result>();
                                UserDetail = (List<prc_EmployeeInfo_Result>)Session["UserDetail"];

                                //JsonResult jsonUserDetail = DataController_.GetUserDetailBySession();

                                //var UserDetail = jsonUserDetail.Data as EmployeeDetail;
                                string emaillink = ConfigurationManager.AppSettings["ServerUrl"].ToString() + "Home/Leave";

                                //string emaillink = ConfigurationManager.AppSettings["ServerUrl"].ToString() + "Home/Leave?ID=" + RequestTo[0].RegId + "&Pass=" + Server.UrlEncode(Utilities.Encrypt(RequestTo[0].Password));


                                model.FromName = UserDetail[0].Name;
                                model.FromEmail = UserRegDetail[0].EmailID;
                                //model.FromEmail = "HRIS@pacificjeans.com";


                                //model.To = "linkonb@pacificjeans.com";
                                model.To = RequestTo[0].EmailID;
                                //model.To = "linkonb@pacificjeans.com";
                                //model.Subject = "Leave Application of " + UserDetail[0].Name;

                                model.Subject = "Leave Application " ;

                                model.Body = @"<table>
                                    <tr>
                                          
                                <img id=""1"" src=""cid:pjl_HRIS.png"">

                                    </tr>
                                    <tr>
                                          <p><b>Dear Sir/Madam, </b></p>
                            
                                    <p>I wish to apply for <font color=#003300><b> " + EmpLeaveApp.LDays + @"</b> working day(s)</font> " + EmpLeaveApp.LType + @" leave from the <font color=#003300><b>" + EmpLeaveApp.FrDate.ToString("dd-MM-yyyy") + @"</b></font> to <font color=#003300><b>" + EmpLeaveApp.ToDate.ToString("dd-MM-yyyy") + @"</b></font>. [Reason: 
                            
                                   <b> " + EmpLeaveApp.Reasons + @"</b>]</p>

                            
                            <p>My Desk will be Looking after by ""<b> " + Utilities.ToTitleCase(UserDeskLookDetail[0].Name.ToLower()) + @"""</b> during my leave .</p>
                            
                            <p>Please <a href=""" + emaillink+ @""">  Click here    </a>  to Approve/Reject my application.</p>


                                    <p>Yours faithfully<br/>                           
                                    Name        :<b>" + Utilities.ToTitleCase(UserDetail[0].Name.ToLower()) + @"</b><br/>
                                    Emp. Code   :" + Utilities.ToTitleCase(UserDetail[0].EmployeeCode.ToLower()) + @"<br/>
                                    Designation : " + Utilities.ToTitleCase(UserDetail[0].Designation.ToLower()) + @"<br/>
                                    Section     : " + Utilities.ToTitleCase(UserDetail[0].Section.ToLower()) + @"<br/>
                                    Department  : " + UserDetail[0].Department.ToLower() + @"<br/>
                                    <p>


                                    </tr>

                                <tr>


                                        
                                    </tr>

                                   
                            </table>";




                                message = Utilities.SendMail(model,"Leave").Data.ToString();




                                // send email to Desk Look After:

                               
                                //model.To = "linkonb@pacificjeans.com";
                                model.To = DeskLook[0].EmailID;
                                //model.To = "linkonb@pacificjeans.com";
                                //model.Subject = "Leave Application of " + UserDetail[0].Name;

                                model.Subject = "Leave Application -- Desk Look After";

                                model.Body = @"<table>
                                    <tr>
                                          
                                <img id=""1"" src=""cid:pjl_HRIS.png"">

                                    </tr>
                                    <tr>
                                          <p><b>Dear Colleagues, </b></p>
                            
                                    <p>I wish to apply for <font color=#003300><b> " + EmpLeaveApp.LDays + @"</b> working day(s)</font> " + EmpLeaveApp.LType + @" leave from the <font color=#003300><b>" + EmpLeaveApp.FrDate.ToString("dd-MM-yyyy") + @"</b></font> to <font color=#003300><b>" + EmpLeaveApp.ToDate.ToString("dd-MM-yyyy") + @"</b></font>. [Reason: 
                            
                                   <b> " + EmpLeaveApp.Reasons + @"</b>]</p>

                            
                            <p>You (<b> " + Utilities.ToTitleCase(UserDeskLookDetail[0].Name.ToLower()) + @" </b> ) are Requested to Look after My Desk during my leave .</p>
                            
                            

                                    <p>Yours faithfully<br/>                           
                                    Name        :<b>" + Utilities.ToTitleCase(UserDetail[0].Name.ToLower()) + @"</b><br/>
                                    Emp. Code   :" + Utilities.ToTitleCase(UserDetail[0].EmployeeCode.ToLower()) + @"<br/>
                                    Designation : " + Utilities.ToTitleCase(UserDetail[0].Designation.ToLower()) + @"<br/>
                                    Section     : " + Utilities.ToTitleCase(UserDetail[0].Section.ToLower()) + @"<br/>
                                    Department  : " + UserDetail[0].Department.ToLower()+ @"<br/>
                                    <p>


                                    </tr>

                                <tr>


                                        
                                    </tr>

                                   
                            </table>";


                                message = Utilities.SendMail(model, "Leave").Data.ToString();

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

       


        public JsonResult LeaveApplicationUpdate(tblEmpLeaveApp EmpLeaveApp)
        {

            string message = "";

            using (Entities dc = new Entities())
            {
                //check username available
                //var user = dc.tblUserRegistrations.FirstOrDefault();

                var employeeDetails = dc.tblEmpLeaveApps.Where(x => x.RegId == EmpLeaveApp.RegId & x.AppliedDate == EmpLeaveApp.AppliedDate).FirstOrDefault();


                //var employeeDetails = dc.tblUser_Registration.Where(x => x.EmployeeCode == u.EmployeeCode & x.ComID == u.ComID).FirstOrDefault();



                employeeDetails.Status = EmpLeaveApp.Status;
                employeeDetails.StatusReasons = EmpLeaveApp.StatusReasons;
                //employeeDetails.last_login_date = DateTime.Now;
                employeeDetails.Updated_by = Request.UserHostName;
                employeeDetails.Updated_date = DateTime.Now;

                dc.SaveChanges();
                message = "Success";

            }




            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }



        public JsonResult LeaveInsertMainDatabase(tblEmpLeaveApp EmpLeaveApp)
        {

            string message = "";

            
                using (Entities dc = new Entities())
                {

                    //string RegId = Session["LoginID"].ToString();

                    //string Year = (Request.QueryString["Year"]);

                    List<ProcedureReturnStatus> LeaveApplyStatusList = new List<ProcedureReturnStatus>();

                    using (Entities context = new Entities())
                    {

                        LeaveApplyStatusList = context.Database.SqlQuery<ProcedureReturnStatus>(@" exec prc_EmployeeLeaveInsertMainDatabase
                        {0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11}",
                                                    EmpLeaveApp.RegId ,
                                                    EmpLeaveApp.AppliedDate ,
                                                    EmpLeaveApp.RequestTo ,
                                                    EmpLeaveApp.ActingPerson ,
                                                    EmpLeaveApp.LType ,
                                                    EmpLeaveApp.LDays ,
                                                    EmpLeaveApp.FrDate.Date ,
                                                    EmpLeaveApp.ToDate.Date,
                                                    EmpLeaveApp.Reasons,
                                                    EmpLeaveApp.Status ,
                                                    EmpLeaveApp.Created_date ,
                                                    EmpLeaveApp.Created_By 
                                                    ).ToList();
                    }


                    if (LeaveApplyStatusList[0].Status == false)
                    {
                        message = LeaveApplyStatusList[0].Message.ToString();

                    }
                    else
                    {                      
                        message = "Success";
                    } 
                    

                }
            

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult LeaveDeleteMainDatabase(tblEmpLeaveApp EmpLeaveApp)
        {

            string message = "";


            using (Entities dc = new Entities())
            {

                //string RegId = Session["LoginID"].ToString();

                //string Year = (Request.QueryString["Year"]);

                List<ProcedureReturnStatus> LeaveApplyStatusList = new List<ProcedureReturnStatus>();

                using (Entities context = new Entities())
                {

                    LeaveApplyStatusList = context.Database.SqlQuery<ProcedureReturnStatus>(@" exec prc_EmployeeLeaveDeleteMainDatabase
                        {0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11}",
                                                EmpLeaveApp.RegId,
                                                EmpLeaveApp.AppliedDate,
                                                EmpLeaveApp.RequestTo,
                                                EmpLeaveApp.ActingPerson,
                                                EmpLeaveApp.LType,
                                                EmpLeaveApp.LDays,
                                                EmpLeaveApp.FrDate.Date,
                                                EmpLeaveApp.ToDate.Date,
                                                EmpLeaveApp.Reasons,
                                                EmpLeaveApp.Status,
                                                EmpLeaveApp.Created_date,
                                                EmpLeaveApp.Created_By
                                                ).ToList();
                }


                if (LeaveApplyStatusList[0].Status == false)
                {
                    message = LeaveApplyStatusList[0].Message.ToString();

                }
                else
                {
                    message = "Success";
                }


            }


            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    
    }
}
