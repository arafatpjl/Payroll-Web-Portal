using Newtonsoft.Json;
using PacificPortal.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PacificPortal.Controllers
{
    public class AttendenceController : Controller
    {

        //Leave Status

        public JsonResult GetAttenApplyStatus()
        {
            string RegId = Session["LoginID"].ToString();

            string Month = (Request.QueryString["Month"]);
            string Year = (Request.QueryString["Year"]);


            List<tbl_EmpAttenApp> LeaveApplyStatusList = new List<tbl_EmpAttenApp>();

            using (Entities context = new Entities())
            {
                LeaveApplyStatusList = context.Database.SqlQuery<tbl_EmpAttenApp>("exec prc_EmployeeAttenApp  {0},{1},{2}", RegId, Month, Year).ToList();
            }

            return new JsonResult { Data = LeaveApplyStatusList, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }


        public JsonResult GetEmployeeAttenApproved()
        {
            //byte CompID = byte.Parse( Session["CompID"].ToString());

            string RegId = Session["LoginID"].ToString();

            string Month = (Request.QueryString["Month"]);
            string Year = (Request.QueryString["Year"]);


            List<prc_EmployeeAttenInfo_Result> EmployeeLeaveInfo = new List<prc_EmployeeAttenInfo_Result>();

            using (Entities context = new Entities())
            {
                EmployeeLeaveInfo = context.Database.SqlQuery<prc_EmployeeAttenInfo_Result>("exec prc_EmployeeAttenInfo  {0},{1}", Month, Year).ToList();
            }
            return new JsonResult { Data = EmployeeLeaveInfo, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }




        //Leave Status
        [HttpPost]
        public JsonResult EmpAttenUpdate(tblEmpAttenApp EmpAttenApp)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();


            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {

                    EmpAttenApp.Process = false;


                    EmpAttenApp.Created_By = Request.UserHostName;
                    EmpAttenApp.Created_date = DateTime.Now;

                    if (EmpAttenApp.Status == "PENDING")
                    {
                        var EmpAtten = dc.tblEmpAttenApps.Where(x => x.RegId == EmpAttenApp.RegId & x.prDate == EmpAttenApp.prDate).FirstOrDefault();

                        string RegId = Session["LoginID"].ToString();

                        EmpAtten.TimeIn = EmpAttenApp.TimeIn;
                        EmpAtten.TimeOut = EmpAttenApp.TimeOut;
                        EmpAtten.Reasons = EmpAttenApp.Reasons;

                        EmpAtten.Updated_by = RegId; //Request.UserHostName;
                        EmpAtten.Updated_date = DateTime.Now;

                    }
                    else
                    {
                        dc.tblEmpAttenApps.Add(EmpAttenApp);
                    }

                    dc.SaveChanges();
                    message = "Success";

                }
            }
            else
            {
                message = "Validation Failed!";
            }

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }





        public JsonResult EmpAttenApprove(tblEmpAttenApp EmpAttenApp)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();



            using (Entities dc = new Entities())
            {

                var EmpAtten = dc.tblEmpAttenApps.Where(x => x.RegId == EmpAttenApp.RegId & x.prDate == EmpAttenApp.prDate).FirstOrDefault();

               


                List<ProcedureReturnStatus> LeaveApplyStatusList = new List<ProcedureReturnStatus>();

                using (Entities context = new Entities())
                {

                    LeaveApplyStatusList = context.Database.SqlQuery<ProcedureReturnStatus>(@" exec prc_EmployeeAttenInsertMainDatabase
                        {0},{1}",
                                                EmpAtten.RegId,
                                                EmpAtten.prDate
                                                ).ToList();
                }


                if (LeaveApplyStatusList[0].Status == false)
                {
                    message = LeaveApplyStatusList[0].Message.ToString();

                }
                else
                {

                    EmpAtten.Process = true;

                    string RegId = Session["LoginID"].ToString();

                    EmpAtten.Updated_by = RegId; //Request.UserHostName;
                    EmpAtten.Updated_date = DateTime.Now;

                    dc.SaveChanges();
                    message = "Success";

                }

            }


            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        public JsonResult EmpAttenDecline(tblEmpAttenApp EmpAttenApp)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();



            using (Entities dc = new Entities())
            {

                var EmpAtten = dc.tblEmpAttenApps.Where(x => x.RegId == EmpAttenApp.RegId & x.prDate == EmpAttenApp.prDate).FirstOrDefault();

                dc.tblEmpAttenApps.Remove(EmpAtten);
                dc.SaveChanges();
                message = "Success";

            }

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }




    }
}
