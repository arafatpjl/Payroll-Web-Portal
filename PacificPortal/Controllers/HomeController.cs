using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PacificPortal.Models;
using Newtonsoft.Json;
using System.IO;

namespace PacificPortal.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/         
        public ActionResult Index()
        {                  
            Session["LoginID"] = null;           
            Session["HeaderFooter"] = "show";
            //getUserSession();
            return View();
        }

        public ActionResult GetImg(string imageURL)
        {

                var bytes = System.IO.File.ReadAllBytes(imageURL);
                return File(bytes, "image/jpg");
           
        }

        public void getUserSession(string UserMenu)
        {
            List<prc_EmployeeInfo_Result> UserInfo = new List<prc_EmployeeInfo_Result>();
           

            ////UserInfo[0].Name = "";
            ////UserInfo[0].EmployeeCode = "";
            ////UserInfo[0].Designation = "";
            ////UserInfo[0].Department = "";
            ////UserInfo[0].Section = "";
           

            UserInfo = (List<prc_EmployeeInfo_Result>)Session["UserDetail"];
            ViewBag.UserInfo = UserInfo;



            List<UserMenu> UserMenus = new List<UserMenu>();
            UserMenus = (List<UserMenu>)System.Web.HttpContext.Current.Session["UserMenu"];

            ViewBag.UserMenus = UserMenus;


            var data = UserMenus.Where(m => m.Menu_URL == UserMenu).ToList();

            if (data.Count > 0)
            {

                ViewBag.UserMenuPermitted = true;
            }
            else 
            {
                ViewBag.UserMenuPermitted = false;
            }
        }

        public ActionResult Registration()
        {
            Session["HeaderFooter"] = "show";
            return View();
        }

        public ActionResult Logout()
        {
           
            Response.Buffer = true;
            Response.ExpiresAbsolute = DateTime.Now.AddDays(-1d);
            Response.Expires = 0;
            Response.CacheControl = "no-cache";

            return RedirectToAction("Index");
        }


        public ActionResult RecoveryPassword()
        {           
           Session["HeaderFooter"] = "show";
            return View();
        }

        
        
        public ActionResult Deshboard()
        {
            Session["HeaderFooter"] = "show";
            if (Session["LoginID"] != null)
            {
                getUserSession("Deshboard");

                return View();
            }
            else
            {
                return RedirectToAction("Index");
            }
        }


        public ActionResult UserProfile()
        {
            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {

                getUserSession("UserProfile");

                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }
        }



        public ActionResult EmpBirthday()
        {
            Session["HeaderFooter"] = "show";

            
            if (Session["LoginID"] != null)
            {
                getUserSession("EmpBirthday");
              
                return View();
            }
            else
            {
                return RedirectToAction("Index");
            }

        }



        public ActionResult EmpOTRequisition()
        {
            Session["HeaderFooter"] = "show";

           
            if (Session["LoginID"] != null)
            {
                getUserSession("EmpOTRequisition");


                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }

        }

        public ActionResult EmpOTDetailsSummary()
        {
            Session["HeaderFooter"] = "show";


            if (Session["LoginID"] != null)
            {
                getUserSession("EmpOTDetailsSummary");


                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }

        }

        //public ActionResult EmpOTRequApprove()
        //{
        public ActionResult EmpOTRequApprove(string ID, string Pass, string ComID)
        {
            if (ID != null && Pass != null)
            {

                try
                {
                    DataController DataController_ = new DataController();

                    JsonResult UserReg = DataController_.GetEmployeeDetailByRegId(ID);
                    var jsonUserReg = JsonConvert.SerializeObject(UserReg.Data);
                    List<prc_EmployeeInfo_Result> UserRegDetail = JsonConvert.DeserializeObject<List<prc_EmployeeInfo_Result>>(jsonUserReg);


                    System.Web.HttpContext.Current.Session["EmpDetail"] = UserRegDetail;

                    tblUser_Registration tblUser = new tblUser_Registration();
                    tblUser.RegId = int.Parse(ID);
                    tblUser.Password = Server.UrlDecode(Utilities.Decrypt(Pass));

                    UserController UserController_ = new UserController();
                    UserController_.Login_check(tblUser);

                    tblUser_LogInfo tblUser_LogInfo_ = new tblUser_LogInfo();
                    tblUser_LogInfo_.RegId = tblUser.RegId;
                    UserController_.SaveLoginInfo(tblUser_LogInfo_);
                }
                catch
                {

                }
            }
            
            Session["HeaderFooter"] = "show";

           

            if (Session["LoginID"] != null)
            {
                getUserSession("EmpOTRequApprove");

                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }

        }


        public ActionResult EmpOTRequReport()
        {

            Session["HeaderFooter"] = null;

            if (Session["LoginID"] != null)
            {
                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        public ActionResult EmpOTDetailsReport()
        {

            Session["HeaderFooter"] = null;

            if (Session["LoginID"] != null)
            {
                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }
        }


        public ActionResult EmpInfo()
        {


            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {

                getUserSession("EmpInfo");


                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }

               
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        public ActionResult JobCard()
        {

            Session["HeaderFooter"] = "show";


            if (Session["LoginID"] != null)
            {
                getUserSession("JobCard");

                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }

            }
            else
            {
                return RedirectToAction("Index");
            }

        }
        

        public ActionResult JobCardDetail()
        {

            Session["HeaderFooter"] = null;

            if (Session["LoginID"] != null)
            {
                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }
        }




        public ActionResult AttenApprove()
        {

            Session["HeaderFooter"] = "show";


            if (Session["LoginID"] != null)
            {
                getUserSession("AttenApprove");

                    if (ViewBag.UserMenuPermitted)
                    {

                        return View();
                    }
                    else
                    {
                        return RedirectToAction("Deshboard");
                    }
                

            }
            else
            {
                return RedirectToAction("Index");
            }
        }



        public ActionResult Leave(string ID, string Pass)
        {
            if (ID != null && Pass != null)
            {

                try
                {
                    DataController DataController_ = new DataController();

                    JsonResult UserReg = DataController_.GetEmployeeDetailByRegId(ID);
                    var jsonUserReg = JsonConvert.SerializeObject(UserReg.Data);
                    List<prc_EmployeeInfo_Result> UserRegDetail = JsonConvert.DeserializeObject<List<prc_EmployeeInfo_Result>>(jsonUserReg);


                    System.Web.HttpContext.Current.Session["EmpDetail"] = UserRegDetail;

                    tblUser_Registration tblUser = new tblUser_Registration();
                    tblUser.RegId = int.Parse(ID);
                    tblUser.Password = Server.UrlDecode(Utilities.Decrypt(Pass));

                    UserController UserController_ = new UserController();
                    UserController_.Login_check(tblUser);

                    tblUser_LogInfo tblUser_LogInfo_ = new tblUser_LogInfo();
                    tblUser_LogInfo_.RegId = tblUser.RegId;
                    UserController_.SaveLoginInfo(tblUser_LogInfo_);
                }
                catch
                { 
                
                }
            }


            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("Leave");

                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }

            }
            else
            {
                return RedirectToAction("Index");
            }
        }



        public ActionResult LeaveCardDetail()
        {

            Session["HeaderFooter"] = null;

            if (Session["LoginID"] != null)
            {
                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }
        }



        public ActionResult LeaveApprove()
        {

            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("LeaveApprove");

                 if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                 else
                 {
                     return RedirectToAction("Deshboard");
                 }

            }
            else
            {
                return RedirectToAction("Index");
            }
        }



        public ActionResult AlbumAdmin()
        {

            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("AlbumAdmin");

                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }

            }
            else
            {
                return RedirectToAction("Index");
            }
        }



        public ActionResult AlbumPermission()
        {

            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
               // getUserSession("AlbumPermission");
                getUserSession("AlbumAdmin");

                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }

            }
            else
            {
                return RedirectToAction("Index");
            }
        }


        public ActionResult AlbumPublish()
        {

            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("AlbumPublish");
                            

                    return View();
               

            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        public ActionResult FabricDetailsEntry()
        {
            Session["HeaderFooter"] = "show";


            if (Session["LoginID"] != null)
            {
                getUserSession("FabricDetailsEntry");


                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }

        }
        public ActionResult FabricInfo()
        {
            Session["HeaderFooter"] = "show";


            if (Session["LoginID"] != null)
            {
                getUserSession("FabricInfo");


                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }

        }

        public ActionResult WeeklyOTreport()
        {
            Session["HeaderFooter"] = "show";


            if (Session["LoginID"] != null)
            {
                getUserSession("WeeklyOTreport");


                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }

        }

        public ActionResult WeeklyOTDetail()
        {

            Session["HeaderFooter"] = null;

            if (Session["LoginID"] != null)
            {
                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }
        }
        

        public ActionResult HelpLine()
        {
            
            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("HelpLine");

                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }

            }
            else
            {
                return RedirectToAction("Index");
            }
        }




        public ActionResult BusSchedule()
        {
            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("BusSchedule");
                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        public ActionResult BusScheduleAdmin()
        {
            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("BusScheduleAdmin");                

                if (ViewBag.UserMenuPermitted)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("Deshboard");
                }

            }
            else
            {
                return RedirectToAction("Index");
            }
        }



        public ActionResult Notice()
        {
            Session["HeaderFooter"] = "show";

            if (Session["LoginID"] != null)
            {
                getUserSession("Notice");
                return View();

            }
            else
            {
                return RedirectToAction("Index");
            }

            return View();
        }



        public CrystalReportPdfResult Pdf()
        {
            List<prc_EmployeeInfo_Result> model = new List<prc_EmployeeInfo_Result>();
            //model.Add(new Customer { CompanyName = "Blah Inc.", ContactName = "Joe Blogs" });
            string reportPath = System.Web.Hosting.HostingEnvironment.MapPath("~/CrystalReport/PIB_DailyWithSummary_desWise_WithEff.rpt");
            
            //Report.SetDatabaseLogon("sa", "SOFT2ooo ", "172.16.220.30", "Databasefile");

           
            return new CrystalReportPdfResult(reportPath, model);


            //         <div class="row">
            //    <div class="col-md-10">
            //        <iframe src="@Url.Action("Pdf", "Home")" height="500" width="100%"></iframe>
            //    </div>
            //    <div class="col-md-2">
            //        <h3>Other page content</h3>
            //        <button type="button" class="btn btn-primary">Click here</button>
            //    </div>
            //</div>

        }



        //public ActionResult GetPdf(string fileName)
        //{
        //    var fileStream = new FileStream("~/Content/files/" + fileName,
        //                                     FileMode.Open,
        //                                     FileAccess.Read
        //                                   );
        //    var fsResult = new FileStreamResult(fileStream, "application/pdf");
        //    return fsResult;
        //}


        public FileStreamResult GetPDF(string File_Name)
        {
            string pdf_Path = System.Web.Hosting.HostingEnvironment.MapPath("~/PDF/" + File_Name);

            FileStream fs = new FileStream(pdf_Path, FileMode.Open, FileAccess.Read);
            return File(fs, "application/pdf");
        }

        //public ActionResult ViewPDF()
        //{
        //    string embed = "<object data=\"{0}\" type=\"application/pdf\" width=\"500px\" height=\"300px\">";
        //    embed += "If you are unable to view file, you can download from <a href = \"{0}\">here</a>";
        //    embed += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
        //    embed += "</object>";
        //    TempData["Embed"] = string.Format(embed, VirtualPathUtility.ToAbsolute("~/PDF/Festival_2018.pdf"));

        //    return RedirectToAction("Index");
        //}



       

    }
}
