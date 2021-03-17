using Newtonsoft.Json;
using PacificPortal.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PacificPortal.Controllers
{
    public class BusScheduleController : Controller
    {
        public JsonResult GetBusSchedule(DateTime ScheduleDate)
        {
          //  bool publish = false;

            //DateTime ScheduleDate = DateTime.Parse(ScheduleDate_);
            // ScheduleDate = DateTime.Parse(ScheduleDate.ToString("dd-mmm-yyyy"));

            List<tblBusSchedule> BusSchedule = new List<tblBusSchedule>();
            using (Entities dc = new Entities())
            {
              
                BusSchedule = dc.tblBusSchedules.Where(a => a.Date == ScheduleDate.Date).ToList();
                
                
            }
            return new JsonResult { Data = BusSchedule, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }




        //Leave Status        
        public JsonResult BusScheduleAdd(tblBusSchedule BusSchedule)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();


           // if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {
                    BusSchedule.Created_By = Request.UserHostName;
                    BusSchedule.Created_date = DateTime.Now;

                    dc.tblBusSchedules.Add(BusSchedule);
                    dc.SaveChanges();
                    message = "Success";

                }
            }
            //else
            //{
            //    message = "Validation Failed!";
            //}

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



        //BusSchedule        
        public JsonResult BusScheduleUpdate(tblBusSchedule BusSchedule)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();


            //if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {
                    var BusScheduleUpdate = dc.tblBusSchedules.Where(x => x.ID == BusSchedule.ID).FirstOrDefault();

                    BusScheduleUpdate.VehicleNo = BusSchedule.VehicleNo;
                    BusScheduleUpdate.VehicleType = BusSchedule.VehicleType;
                    BusScheduleUpdate.PassengerCapacity = BusSchedule.PassengerCapacity;
                    BusScheduleUpdate.StartTime = BusSchedule.StartTime;

                    BusScheduleUpdate.Driver = BusSchedule.Driver;
                    BusScheduleUpdate.StartingPoint = BusSchedule.StartingPoint;
                    BusScheduleUpdate.Destination = BusSchedule.Destination;
                    BusScheduleUpdate.RoadName = BusSchedule.RoadName;
                    BusScheduleUpdate.RoadDescription = BusSchedule.RoadDescription;


                    BusScheduleUpdate.Updated_by = Request.UserHostName;
                    BusScheduleUpdate.Updated_date = DateTime.Now;
                    try
                    {
                        dc.SaveChanges();
                    }
                    catch (DbEntityValidationException ex)
                    {
                        string errorMessages = string.Join("; ", ex.EntityValidationErrors.SelectMany(x => x.ValidationErrors).Select(x => x.ErrorMessage));
                        throw new DbEntityValidationException(errorMessages);
                    }


                    //dc.SaveChanges();
                    message = "Success";
                   
                }
            }
            //else
            //{
            //    message = "Validation Failed!";
            //}

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        //PublishBusSchedule        
        public JsonResult PublishBusSchedule(tblBusSchedule BusSchedule)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();


            //if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {
                    //DateTime ScheduleDate=BusSchedule.Date.Value.Date;
                    //var BusScheduleUpdate = dc.tblBusSchedule.Where(x => x.Date == ScheduleDate).ToList();

                    //string[] separators = { ",", ".", "!", "?", ";", ":", " " };
                    string[] separators = { ","};
                    string[] ids_string = BusSchedule.RoadName.Split(separators,StringSplitOptions.RemoveEmptyEntries);
                    int[] ids = ids_string.Select(int.Parse).ToArray();

                    //var BusScheduleUpdate = dc.tblBusSchedule.Where(x => x.ID.Contains(ids)).ToList();
                    var BusScheduleUpdate = dc.tblBusSchedules.Where(x => ids.Contains(x.ID)).ToList();

                    BusScheduleUpdate.ForEach(a=>a.Publish=BusSchedule.Publish);
                    BusScheduleUpdate.ForEach(a => a.Updated_by = Request.UserHostName);
                    BusScheduleUpdate.ForEach(a => a.Updated_date = DateTime.Now);


                    try
                    {
                        dc.SaveChanges();
                    }
                    catch (DbEntityValidationException ex)
                    {
                        string errorMessages = string.Join("; ", ex.EntityValidationErrors.SelectMany(x => x.ValidationErrors).Select(x => x.ErrorMessage));
                        throw new DbEntityValidationException(errorMessages);
                    }


                    //dc.SaveChanges();
                    message = "Success";
                   
                }
            }
            //else
            //{
            //    message = "Validation Failed!";
            //}

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



        //BusScheduleDelete
               public JsonResult BusScheduleDelete(tblBusSchedule BusSchedule)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();


            //if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {
                    var BusScheduleUpdate = dc.tblBusSchedules.Where(x => x.ID == BusSchedule.ID).FirstOrDefault();

                   
                    try
                    {
                        dc.tblBusSchedules.Remove(BusScheduleUpdate);
                        dc.SaveChanges();
                    }
                    catch (DbEntityValidationException ex)
                    {
                        string errorMessages = string.Join("; ", ex.EntityValidationErrors.SelectMany(x => x.ValidationErrors).Select(x => x.ErrorMessage));
                        throw new DbEntityValidationException(errorMessages);
                    }


                    //dc.SaveChanges();
                    message = "Success";
                   
                }
            }
            //else
            //{
            //    message = "Validation Failed!";
            //}

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



               public JsonResult CopyBusSchedule(tblBusSchedule BusSchedule)
        {

            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();
        
            string errors_string = JsonConvert.SerializeObject(ModelState.Values.SelectMany(state => state.Errors).Select(error => error.ErrorMessage));

            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {

                    List<ProcedureReturnStatus> ProcedureReturnStatus = new List<ProcedureReturnStatus>();

                    using (Entities context = new Entities())
                    {

                        ProcedureReturnStatus = context.Database.SqlQuery<ProcedureReturnStatus>(@" exec prc_CopyBusSchedule
                        {0},{1},{2}",
                                                    BusSchedule.RoadName,
                                                    BusSchedule.Date,
                                                    Session["LoginID"].ToString()
                                                    ).ToList();
                    }




                    if (ProcedureReturnStatus[0].Status == false)
                    {
                        message = ProcedureReturnStatus[0].Message.ToString();

                    }
                    else
                    {                       
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




    }
}
