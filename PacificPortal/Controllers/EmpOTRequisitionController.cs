using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PacificPortal.Models;
using System.Configuration;
using Newtonsoft.Json;

namespace PacificPortal.Controllers
{
    public class EmpOTRequisitionController : Controller
    {
        // Fetch Prc_Get_OT_Info
        public JsonResult Get_OT_Info(string CompID, DateTime Date, string Department, string Section)
        {
            //string CompID = Request.QueryString["CompID"]; 
            //string EmpCode = Request.QueryString["EmpCode"];
            //DateTime Date = DateTime.Now; string Department = "HR & ADMIN"; string Section = "HOUSE KEEPING";

            List<Prc_Get_OTRequ_Info_Result> empOT_Info = new List<Prc_Get_OTRequ_Info_Result>();

            using (Entities context = new Entities())
            {

                empOT_Info = context.Database.SqlQuery<Prc_Get_OTRequ_Info_Result>("exec Prc_Get_OTRequ_Info  {0},{1},{2},{3}", CompID, Date, Department, Section).ToList();
                //Prc_Get_OT_Info
            }

            return new JsonResult { Data = empOT_Info, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }


        public JsonResult Get_OT_Daily_Approve_Summary(string CompID, DateTime Date, string Department, string OTReqType)
        {
            //string CompID = Request.QueryString["CompID"]; 
            //string EmpCode = Request.QueryString["EmpCode"];
            //DateTime Date = DateTime.Now; string Department = "HR & ADMIN"; string Section = "HOUSE KEEPING";

            List<Prc_Get_OTApprove_Summary_Info> empOT_Info = new List<Prc_Get_OTApprove_Summary_Info>();

            using (Entities context = new Entities())
            {

                empOT_Info = context.Database.SqlQuery<Prc_Get_OTApprove_Summary_Info>("exec Prc_Get_OTApprove_Summary_Info  {0},{1},{2},{3}", CompID, Date, Department, OTReqType).ToList();
                //Prc_Get_OT_Info
            }

            return new JsonResult { Data = empOT_Info, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }




        // Fetch Prc_Get_OT_Summary
        public JsonResult Get_OT_Summary(string CompID, DateTime DateFrom, DateTime DateTo)
        {
            //string CompID = Request.QueryString["CompID"]; 
            //string EmpCode = Request.QueryString["EmpCode"];
            //DateTime Date = DateTime.Now; string Department = "HR & ADMIN"; string Section = "HOUSE KEEPING";

            List<Prc_Get_OTRequ_Summary_Result> empOT_Info = new List<Prc_Get_OTRequ_Summary_Result>();

            using (Entities context = new Entities())
            {

                empOT_Info = context.Database.SqlQuery<Prc_Get_OTRequ_Summary_Result>("exec Prc_Get_OTRequ_Summary  {0},{1},{2}", CompID, DateFrom.Date, DateTo.Date).ToList();
                //Prc_Get_OT_Info
            }

            return new JsonResult { Data = empOT_Info, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        // Fetch Prc_Get_OT_Summary
        public JsonResult Get_Weekly_OT_Summary(string CompID, DateTime FromDate, DateTime ToDate)
        {
            //string CompID = Request.QueryString["CompID"]; 
            //string EmpCode = Request.QueryString["EmpCode"];
            //DateTime Date = DateTime.Now; string Department = "HR & ADMIN"; string Section = "HOUSE KEEPING";

            List<prc_Weekly_OT_Report_Info> empOT_Info = new List<prc_Weekly_OT_Report_Info>();

            using (Entities context = new Entities())
            {

                empOT_Info = context.Database.SqlQuery<prc_Weekly_OT_Report_Info>("exec prc_Weekly_OT_Report  {0},{1},{2}", CompID, FromDate.Date, ToDate.Date).ToList();
                //Prc_Get_OT_Info
            }

            return new JsonResult { Data = empOT_Info, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }




        // Fetch Emp OT ApproveLoginID
        public JsonResult GetApproveLoginID()
        {
            List<tblEmpOTApprovePermission> allUnit = new List<tblEmpOTApprovePermission>();
            using (Entities dc = new Entities())
            {
                allUnit = dc.tblEmpOTApprovePermission.Where(a => a.YsnActive == true).ToList();

            }
            return new JsonResult { Data = allUnit, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }




         [HttpPost]
        public JsonResult OTRequ_delete(OTRequ OTRequ)
        {
            string message = "";

           
                try
                {

                    List<ProcedureReturnStatus> StatusList = new List<ProcedureReturnStatus>();

                    using (Entities context = new Entities())
                    {

                        StatusList = context.Database.SqlQuery<ProcedureReturnStatus>(@" exec Prc_OTRequ_Reset
                                                {0},{1},{2},{3}",
                                                    OTRequ.CompID, 
                                                    OTRequ.Date,
                                                    OTRequ.Department,
                                                    OTRequ.Section                                                    
                                                    ).ToList();
                    }




                    if (StatusList[0].Status == false)
                    {
                        message = StatusList[0].Message.ToString();

                    }
                    else
                    {
                        message = "Success";
                    }

                }

                catch
                {

                }
           
           
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }




         public JsonResult OTRequ_update(tblEmpOTRequ Emp)
         {
             string message = "";

             //check username available
             //var user = dc.tblUserRegistrations.FirstOrDefault();
             if (Emp != null)
             {
                 try
                 {
                     using (Entities dc = new Entities())
                     {

                         var employeeDetails = dc.tblEmpOTRequs.Where(x => x.ComID == Emp.ComID & x.EmpCode == Emp.EmpCode & x.Date == Emp.Date.Date).FirstOrDefault();

                         if (employeeDetails != null)
                         {
                             employeeDetails.RequestOT = Emp.OTRequ;
                             employeeDetails.OTRequ = Emp.OTRequ;
                             employeeDetails.Updated_by = Request.UserHostName;
                             employeeDetails.Updated_date = DateTime.Now;
                             dc.SaveChanges();
                             message = "Success";
                         }
                         else
                         {
                             Emp.Created_By = Request.UserHostName;
                             Emp.Created_date = DateTime.Now;
                             Emp.RequestOT = Emp.OTRequ;
                             dc.tblEmpOTRequs.Add(Emp);
                             dc.SaveChanges();
                             message = "Success";
                         }

                     }
                 }

                 catch
                 {

                 }

             }


             return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
         }

        public JsonResult OTRequ_Email(tblEmpOTApprovePermission OTApprove)
        {
            string message = "";
         
                    //check username available
                    //var user = dc.tblUserRegistrations.FirstOrDefault();
                      if (OTApprove != null)
                    {                        
                            try
                            {
                                using (Entities dc = new Entities())
                                {

                                    List<ProcedureReturnStatus> StatusList = new List<ProcedureReturnStatus>();

                                    StatusList = dc.Database.SqlQuery<ProcedureReturnStatus>(@" exec prc_Get_OTRequEmail
                                                {0},{1}",
                                                    OTApprove.ID,                                                  
                                                    OTApprove.Created_date                                               
                                                    ).ToList();



                                            if (StatusList[0].Status == false)
                                            {
                                                message = StatusList[0].Message.ToString();

                                            }
                                            else
                                            {
                                                message = "Success";
                                            }



                                            DataController DataController_ = new DataController();

                                    string RegId = Session["LoginID"].ToString();

                                    JsonResult UserReg = DataController_.GetRegistrationDetailByRegId(RegId.ToString());
                                    var jsonUserReg = JsonConvert.SerializeObject(UserReg.Data);
                                    List<tblUser_Registration> UserRegDetail = JsonConvert.DeserializeObject<List<tblUser_Registration>>(jsonUserReg);
                                   
                                    List<prc_EmployeeInfo_Result> UserDetail = new List<prc_EmployeeInfo_Result>();
                                    UserDetail = (List<prc_EmployeeInfo_Result>)Session["UserDetail"];

                                     JsonResult jsonRequestTo = DataController_.GetRegistrationDetailByRegId(OTApprove.RegId.ToString());
                                    var json = JsonConvert.SerializeObject(jsonRequestTo.Data);
                                    List<tblUser_Registration> RequestTo = JsonConvert.DeserializeObject<List<tblUser_Registration>>(json);



                                    string emaillink = ConfigurationManager.AppSettings["ServerUrl"].ToString() + "Home/EmpOTRequApprove?ID=" + RequestTo[0].RegId + "&Pass=" + Server.UrlEncode(Utilities.Encrypt(RequestTo[0].Password)) + "&ComID=" + OTApprove.ID;

                                    EmailModel model = new EmailModel();


                                    model.FromName = UserDetail[0].Name;
                                    model.FromEmail = UserRegDetail[0].EmailID;
                                   // model.FromEmail = "HRIS@pacificjeans.com";

                                 
                                     model.To = OTApprove.EmailID;
                                   // model.To = "linkonb@pacificjeans.com";
                                    //model.To = RequestTo[0].EmailID;
                                    //model.To = "linkonb@pacificjeans.com";
                                    //model.Subject = "Leave Application of " + UserDetail[0].Name;


                                    model.Subject = "Requisition For OT";

                                    string body=@"";

                                    body = body + @"<img style=""align =right"" id=""1"" src=""cid:pjl_HRIS.png"">";

                                    body = body + StatusList[0].Message.ToString();

                                    body = body.Replace("emaillink", emaillink);

                                    model.Body = body;




                                    message = Utilities.SendMail(model, "Leave").Data.ToString();

                                    message = "Success";

                                    model.To = UserRegDetail[0].EmailID;

                                    model.Subject = "Requisition For OT (Copy)";

                                    body = body.Replace(emaillink, "null");
                                    model.Body = body;

                                    Utilities.SendMail(model, "Leave").Data.ToString();

                                }
                            }

                            catch
                            { 
                            
                            }                        
                    
                         }

           
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult OTRequ_Approve_Mail(int CompID, DateTime DailyDate)
        {
            string message = "";
           
            List<tblEmpOTApprovePermission> empOTApprove_Mail = new List<tblEmpOTApprovePermission>();

            using (Entities dc = new Entities())
            {
                empOTApprove_Mail = dc.tblEmpOTApprovePermission.Where(a => a.ComID == CompID & a.PublishActive == true).ToList();

                if (empOTApprove_Mail != null)
                {



                    // send email to team Leader

                    try
                    {
                        EmailModel model = new EmailModel();


                        DataController DataController_ = new DataController();


                        //model.To = "linkonb@pacificjeans.com";
                        model.To = empOTApprove_Mail[0].EmailID;
                        //model.To = "linkonb@pacificjeans.com";
                        //model.Subject = "Leave Application of " + UserDetail[0].Name;

                        model.Subject = "OT Approve Confirmation ";

                        model.Body = @"<table>
                                    <tr>
                                          
                                <img id=""1"" src=""cid:pjl_HRIS.png"">

                                    </tr>
                                    <tr>
                                          <p><b>Dear Sir/Madam, </b></p>
                            
                                    <p> Daily OT Requisition Date of <font color=#003300><b> " + DailyDate.ToShortDateString() + @"</b> has approved.</p>

                            <br/><p>Yours faithfully<br/>                          
                                    Pacific Jeans Group
                                    <p>

                                    </tr>

                                <tr>


                                        
                                    </tr>
                                    
                                   
                            </table>";




                        message = Utilities.SendMail(model, "OT").Data.ToString();


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

            return new JsonResult { Data = empOTApprove_Mail, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        public JsonResult OTRequ_update_App(Prc_Get_OTRequ_Summary_Result OTRequs)
        {
            string message = "";

                    if (OTRequs != null)
                    {


                                 try
                                {

                                List<ProcedureReturnStatus> StatusList = new List<ProcedureReturnStatus>();

                                using (Entities context = new Entities())
                                {

                                    StatusList = context.Database.SqlQuery<ProcedureReturnStatus>(@" exec Prc_OTRequ_Approve
                                                {0},{1},{2},{3},{4},{5},{6},{7},{8}",
                                                                OTRequs.CompID,
                                                                OTRequs.DailyDate,
                                                                OTRequs.Department,
                                                                OTRequs.Section,
                                                                OTRequs.OTRequ,
                                                                OTRequs.Wstatus,
                                                                OTRequs.Approved,
                                                                OTRequs.IsLock,
                                                                Request.UserHostName
                                                                ).ToList();
                                }




                                if (StatusList[0].Status == false)
                                {
                                    message = StatusList[0].Message.ToString();

                                }
                                else
                                {
                                    message = "Success";
                                }

                        }

                                 catch
                                 {

                                 }
                            //}
                       
                                }


                //}
            //}
            
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult OTApproveEditUpdate(OTApproveEditUpdate OTEditUpdate)
        {
            string message = "";


            if (OTEditUpdate != null)
            {
                try
                {

                    List<ProcedureOTApproveStatus> StatusList = new List<ProcedureOTApproveStatus>();

                    using (Entities context = new Entities())
                    {

                        StatusList = context.Database.SqlQuery<ProcedureOTApproveStatus>(@" exec Prc_ApproveOTRequEdit_Update
                                                {0},{1},{2},{3},{4},{5},{6},{7}",
                                                    OTEditUpdate.CompID,
                                                    OTEditUpdate.Date,
                                                    OTEditUpdate.Department,
                                                    OTEditUpdate.Section,
                                                    OTEditUpdate.WStatus,
                                                    OTEditUpdate.RequstOT,
                                                    OTEditUpdate.OTRequ,
                                                    OTEditUpdate.EditReasons
                                                    ).ToList();
                    }




                    if (StatusList.Count >= 1)
                    {
                        message = StatusList[0].Message.ToString();

                    }
                    else
                    {
                        message = "Success";
                    }

                }

                catch
                {

                }

            }


            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



    }
}
