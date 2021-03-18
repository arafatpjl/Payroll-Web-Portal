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
    public class FabricController : Controller
    {

        [HttpPost]

        // for insert 
        public JsonResult FabricInfo_insert(tblFabricInfo u)
        {
            string message = "";
            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var Fabric = dc.tblFabricInfo.Where(a => a.PJLCode.Equals(u.PJLCode)).FirstOrDefault();

                    if (Fabric != null)
                    {
                        message = "Already Insert Data";

                    }
                    else
                    {
                        if (u != null)
                        {
                           
                            //u.Created_By = Request.UserHostName;
                            //u.Created_date = DateTime.Now;

                            dc.tblFabricInfo.Add(u);

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

                        }
                        else
                        {
                            message = "Insertion Failed!";
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

        [HttpPost]

        // for New Mill insert 
        public JsonResult FabricMill_insert(TblFabricMill u)
        {
            string message = "";
            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var Fabric = dc.TblFabricMill.Where(a => a.FabricMill.Equals(u.FabricMill)).FirstOrDefault();

                    if (Fabric != null)
                    {
                        message = "Already Insert Data";

                    }
                    else
                    {
                        if (u != null)
                        {

                            //u.Created_By = Request.UserHostName;
                            //u.Created_date = DateTime.Now;

                            dc.TblFabricMill.Add(u);

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

                        }
                        else
                        {
                            message = "Insertion Failed!";
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
        [HttpPost]

        // for New Content insert 
        public JsonResult FabricContent_insert(TblFabricContent u)
        {
            string message = "";
            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var Fabric = dc.TblFabricContent.Where(a => a.FABRICCONTENT.Equals(u.FABRICCONTENT)).FirstOrDefault();

                    if (Fabric != null)
                    {
                        message = "Already Insert Data";

                    }
                    else
                    {
                        if (u != null)
                        {

                            //u.Created_By = Request.UserHostName;
                            //u.Created_date = DateTime.Now;

                            dc.TblFabricContent.Add(u);

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

                        }
                        else
                        {
                            message = "Insertion Failed!";
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
        // for New Type insert 
        public JsonResult FabricColour_insert(TblFabricColour u)
        {
            string message = "";
            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var Fabric = dc.TblFabricColour.Where(a => a.FabricColour.Equals(u.FabricColour)).FirstOrDefault();

                    if (Fabric != null)
                    {
                        message = "Already Insert Data";

                    }
                    else
                    {
                        if (u != null)
                        {

                            //u.Created_By = Request.UserHostName;
                            //u.Created_date = DateTime.Now;

                            dc.TblFabricColour.Add(u);

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

                        }
                        else
                        {
                            message = "Insertion Failed!";
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
        // for New Type insert 
        public JsonResult FabricType_insert(TblFabricType u)
        {
            string message = "";
            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var Fabric = dc.TblFabricType.Where(a => a.FabricType.Equals(u.FabricType)).FirstOrDefault();

                    if (Fabric != null)
                    {
                        message = "Already Insert Data";

                    }
                    else
                    {
                        if (u != null)
                        {

                            //u.Created_By = Request.UserHostName;
                            //u.Created_date = DateTime.Now;

                            dc.TblFabricType.Add(u);

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

                        }
                        else
                        {
                            message = "Insertion Failed!";
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
        // for New Type insert 
        public JsonResult FabricWeave_insert(TblFabricWave u)
        {
            string message = "";
            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {


                    var Fabric = dc.TblFabricWave.Where(a => a.FabricWave.Equals(u.FabricWave)).FirstOrDefault();

                    if (Fabric != null)
                    {
                        message = "Already Insert Data";

                    }
                    else
                    {
                        if (u != null)
                        {

                            //u.Created_By = Request.UserHostName;
                            //u.Created_date = DateTime.Now;

                            dc.TblFabricWave.Add(u);

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

                        }
                        else
                        {
                            message = "Insertion Failed!";
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

        // Fabric Info update

        [HttpPost]
        public JsonResult FabricInfo_update(tblFabricInfo u)
        {
            string message = "";


            //int RegId = int.Parse(Session["LoginID"].ToString());

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

                        var FabricDetails = dc.tblFabricInfo.Where(x => x.PJLCode == u.PJLCode).FirstOrDefault();

                        FabricDetails.FabricCode = u.FabricCode;
                        FabricDetails.MillID = u.MillID;
                        FabricDetails.ContentID = u.ContentID;
                        FabricDetails.Weight = u.Weight;
                        FabricDetails.WeightUnit = u.WeightUnit;
                        FabricDetails.FabricConst = u.FabricConst;
                        FabricDetails.Width = u.Width;
                        FabricDetails.WidthUnit = u.WidthUnit;
                        FabricDetails.ColourID = u.ColourID;
                        FabricDetails.FabricTypeID = u.FabricTypeID;
                        FabricDetails.FabricFinish = u.FabricFinish;
                        FabricDetails.WeaveID = u.WeaveID;
                        FabricDetails.Price = u.Price;
                        FabricDetails.PriceUnit = u.PriceUnit;
                        FabricDetails.PriceType = u.PriceType;
                        FabricDetails.Remarks = u.Remarks;
                        FabricDetails.CNFPrice = u.CNFPrice;
                        FabricDetails.Fabricwarp = u.Fabricwarp;
                        FabricDetails.Fabricwaft = u.Fabricwaft;

                   

                        FabricDetails.Updated_by = Request.UserHostName;
                        FabricDetails.Updated_date = DateTime.Now;
                        dc.SaveChanges();
                        message = "Success";
                    }
                    else
                    {
                        message = "Fabric Info not available!";
                    }
                }
            }
            else
            {
                message = "Failed!";
            }
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        //json.MaxJsonLength = 2147483644;

        public JsonResult GetFabricInfoDetail()
        {
            List<prc_FabricInfoDetail_Result> empDetails = new List<prc_FabricInfoDetail_Result>();
           

            //// using DBContext (EF 4.1 and above)  
            using (Entities context = new Entities())
            {
                //IEnumerable<EmployeeDetail> empDetails = context.Database.SqlQuery<EmployeeDetail>("exec prc_EmployeeInfo1", null).ToList();

                empDetails = context.Database.SqlQuery<prc_FabricInfoDetail_Result>("exec prc_FabricInfoDetail", "").ToList();
            }
            //JavaScriptSerializer serializer = new JavaScriptSerializer();

            
            //return new JsonResult(Data = empDetails.MyObjects.ToList(), JsonRequestBehavior.AllowGet);
            //return new JsonResult { Data = empDetails,  JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            JsonResult JsonData = new JsonResult { Data = empDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            JsonData.MaxJsonLength = Int32.MaxValue;

            return JsonData;

        }

       

        // Fetch Registration Detail
        //public JsonResult GetFabricDetail()
        //{

        //    int RegId = int.Parse(Session["LoginID"].ToString());

        //    List<tblFabricInfo> user = new List<tblFabricInfo>();
        //    using (Entities dc = new Entities())
        //    {
        //        user = dc.tblUser_Registration.Where(a => a.RegId == RegId).ToList();
        //        user[0].Password = Utilities.Decrypt(user[0].Password);

        //    }
        //    return new JsonResult { Data = user, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        //}
        // Fetch FabricContent
        public JsonResult GetFabricContent()
        {
            List<TblFabricContent> FabricContent = new List<TblFabricContent>();

            using (Entities dc = new Entities())
            {
                FabricContent = dc.TblFabricContent.OrderBy(a => a.FABRICCONTENT).ToList();
            }

            return new JsonResult { Data = FabricContent, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Fetch FabricMill
        public JsonResult GetFabricMill()
        {
            List<TblFabricMill> FabricMill = new List<TblFabricMill>();

            using (Entities dc = new Entities())
            {
                FabricMill = dc.TblFabricMill.OrderBy(a => a.FabricMill).ToList();
            }

            return new JsonResult { Data = FabricMill, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        // Fetch FabricColour
        public JsonResult GetFabricColour()
        {
            List<TblFabricColour> FabricColour = new List<TblFabricColour>();

            using (Entities dc = new Entities())
            {
                FabricColour = dc.TblFabricColour.OrderBy(a => a.FabricColour).ToList();
            }

            return new JsonResult { Data = FabricColour, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        // Fetch FabricType
        public JsonResult GetFabricType()
        {
            List<TblFabricType> FabricType = new List<TblFabricType>();

            using (Entities dc = new Entities())
            {
                FabricType = dc.TblFabricType.OrderBy(a => a.FabricType).ToList();
            }

            return new JsonResult { Data = FabricType, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
        // Fetch FabricWave
        public JsonResult GetFabricWave()
        {
            List<TblFabricWave> FabricWave = new List<TblFabricWave>();

            using (Entities dc = new Entities())
            {
                FabricWave = dc.TblFabricWave.OrderBy(a => a.FabricWave).ToList();
            }

            return new JsonResult { Data = FabricWave, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }





        public string PJLCode { get; set; }
    }
}
