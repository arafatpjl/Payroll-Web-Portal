using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PacificPortal.Models;

namespace PacificPortal.Controllers
{
    public class DataController : Controller
    {

        //UserController UserController = new UserController();
        //Utilities Utilities = new Utilities();

        
        // Fetch GetCompany
        public JsonResult GetCompany()
        {
            List<Company_Information> allUnit = new List<Company_Information>();
            using (Entities dc = new Entities())
            {
                allUnit = dc.Company_Information.OrderBy(a => a.Name).ToList();

            }
            return new JsonResult { Data = allUnit, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        // Fetch GetDeptSec
        public JsonResult GetDeptSec()
        {
            List<tblDeptSec> DeptSecDetails = new List<tblDeptSec>();

            using (Entities dc = new Entities())
            {
                DeptSecDetails = dc.tblDeptSecs.OrderBy(a => a.DeptName).ToList();
            }

            return new JsonResult { Data = DeptSecDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Fetch GetDeptSec
        public JsonResult GetEmpDeptSec(string Type)
        {

            int RegId = int.Parse(Session["LoginID"].ToString());  

            List<prc_GetEmpDeptSec_Result> DeptSecDetails = new List<prc_GetEmpDeptSec_Result>();

            using (Entities dc = new Entities())
            {
                DeptSecDetails = dc.Database.SqlQuery<prc_GetEmpDeptSec_Result>("exec prc_GetEmpDeptSec {0},{1}", RegId, Type).ToList();
            }

            return new JsonResult { Data = DeptSecDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



        // Fetch Registration Detail
        public JsonResult GetRegistrationDetail()
        {

            int RegId =int.Parse( Session["LoginID"].ToString());  

            List<tblUser_Registration> user = new List<tblUser_Registration>();
            using (Entities dc = new Entities())
            {
                user = dc.tblUser_Registration.Where(a => a.RegId==RegId).ToList();
                user[0].Password = Utilities.Decrypt(user[0].Password);

            }
            return new JsonResult { Data = user, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        public JsonResult GetRegistrationDetailByRegId(string RegId_ )
        {
            int RegId;

            if (RegId_ == null)
            {
                RegId = int.Parse(Request.QueryString["RegId"]);
            }
            else
            {
                RegId = int.Parse(RegId_);
            }

            List<tblUser_Registration> user = new List<tblUser_Registration>();
            using (Entities dc = new Entities())
            {
                user = dc.tblUser_Registration.Where(a => a.RegId == RegId).ToList();
                user[0].Password = Utilities.Decrypt(user[0].Password);

            }
            return new JsonResult { Data = user, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



        // Fetch EmployeeDetail
        public JsonResult GetEmployeeDetail()
        {
            List<prc_EmployeeInfo_Result> empDetails = new List<prc_EmployeeInfo_Result>();

            //// using DBContext (EF 4.1 and above)  
            using (Entities context = new Entities())
            {
                 empDetails = context.Database.SqlQuery<prc_EmployeeInfo_Result>("exec prc_EmployeeInfo", "").ToList();
            }

            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

      


        // Fetch EmployeeDetail
        public JsonResult GetEmployeeInfoDetail()
        {
            List<prc_EmployeeInfoDetail_Result> empDetails = new List<prc_EmployeeInfoDetail_Result>();

            //// using DBContext (EF 4.1 and above)  
            using (Entities context = new Entities())
            {
                //IEnumerable<EmployeeDetail> empDetails = context.Database.SqlQuery<EmployeeDetail>("exec prc_EmployeeInfo1", null).ToList();

                empDetails = context.Database.SqlQuery<prc_EmployeeInfoDetail_Result>("exec prc_EmployeeInfoDetail", "").ToList();
            }

            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        // Fetch EmployeeBirthDay
        public JsonResult GetEmployeeBirthDay()
        {
            List<prc_EmployeeInfoDetail_Result> empDetails = new List<prc_EmployeeInfoDetail_Result>();

            //// using DBContext (EF 4.1 and above)  
            using (Entities context = new Entities())
            {

                empDetails = context.Database.SqlQuery<prc_EmployeeInfoDetail_Result>("exec prc_EmployeeBirthDay", "").ToList();
            }

            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        // Fetch GetEmployeeDetailByEmpCode
        public JsonResult GetEmployeeDetailByEmpCode(string CompID, string EmpCode)
        {
            //string CompID = Request.QueryString["CompID"]; 
            //string EmpCode = Request.QueryString["EmpCode"];
            string EmpCodem = (Request.QueryString["EmpCode"].ToUpper());
            if (EmpCodem.StartsWith("MGT-") == true)
            {
                EmpCode = Request.QueryString["EmpCode"];
            }


            else
            {
                EmpCode = "MGT-" + Request.QueryString["EmpCode"];
            }

            List<prc_EmployeeInfo_Result> empDetails = new List<prc_EmployeeInfo_Result>();

            using (Entities context = new Entities())
            {
               
                empDetails = context.Database.SqlQuery<prc_EmployeeInfo_Result>("exec prc_EmployeeInfoByEmpCode  {0},{1}", CompID, EmpCode).ToList();

                System.Web.HttpContext.Current.Session["EmpDetail"] = empDetails;
              
            }

            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        // Fetch GetEmployeeDetailByRegId
        public JsonResult GetEmployeeDetailByRegId(string RegId_)
        {
            int RegId;

            if (RegId_ == null)
            {
                RegId = int.Parse(Request.QueryString["RegId"]);
            }
            else
            {
                RegId = int.Parse(RegId_);
            }


            List<prc_EmployeeInfo_Result> empDetails = new List<prc_EmployeeInfo_Result>();

            using (Entities context = new Entities())
            {

                empDetails = context.Database.SqlQuery<prc_EmployeeInfo_Result>("exec prc_EmployeeInfoByRegId  {0}", RegId).ToList();

                //Session["EmpDetail"] = empDetails;

            }

            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }





        // Get UserDetail
        public JsonResult GetUserDetailBySession()
        {

            List<prc_EmployeeInfo_Result> empDetails = new List<prc_EmployeeInfo_Result>();
            empDetails = (List<prc_EmployeeInfo_Result>)Session["UserDetail"];

            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

       


        // Get Team Member 
        public JsonResult GetTeamMember(string RegId_)
        {
           
            int RegId;

            if (RegId_ == null)
            {
                RegId = int.Parse(Request.QueryString["RegId"]);
            }
            else
            {
                RegId = int.Parse(RegId_);
            }



            List<prc_EmployeeInfo_Result> empDetails = new List<prc_EmployeeInfo_Result>();

            using (Entities context = new Entities())
            {

                empDetails = context.Database.SqlQuery<prc_EmployeeInfo_Result>("exec prc_GetTeamMember  {0}", RegId).ToList();

                System.Web.HttpContext.Current.Session["TeamMember"] = empDetails;

            }

            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        // Get Team Member 
        public JsonResult GetTeamMemberBySession()
        {
           
            List<prc_EmployeeInfo_Result> empDetails = new List<prc_EmployeeInfo_Result>();
            empDetails=(List<prc_EmployeeInfo_Result>)Session["TeamMember"];
         
            return new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }



        // Fetch Unit
        public ActionResult ShowJobCard(JobCardParameter data)
        {
            return RedirectToAction("JobCard", data);
        }


        // Fetch GetJobCard
        public JsonResult GetJobCard()
        {
           
            string RegId = Request.QueryString["RegId"];
            string Month = Request.QueryString["Month"];
            string Year = Request.QueryString["Year"];


            List<JobCard> JobCardDetails = new List<JobCard>();

            using (Entities context = new Entities())
            {
                JobCardDetails = context.Database.SqlQuery<JobCard>("exec prc_EmployeeJobCard  {0},{1},{2}", RegId, Month, Year).ToList();
            }

            return new JsonResult { Data = JobCardDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }


        // Fetch GetNotice
        public JsonResult GetNotice()
        {

            List<tblNotice> Notice = new List<tblNotice>();
            using (Entities dc = new Entities())
            {
                Notice = dc.tblNotices.Where(a => a.YSNActive == true).ToList();
            }
            return new JsonResult { Data = Notice, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        // Fetch GetOttype
        public JsonResult GetOTReqType()
        {
            List<tblOTStatus> OTReqTypeDetails = new List<tblOTStatus>();

            using (Entities dc = new Entities())
            {
                OTReqTypeDetails = dc.tblOTStatus.OrderBy(a => a.ID).ToList();
            }

            return new JsonResult { Data = OTReqTypeDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


    }
}
