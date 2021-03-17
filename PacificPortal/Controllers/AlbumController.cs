using PacificPortal.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Validation;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PacificPortal.Controllers
{
    public class AlbumController : Controller
    {
        //
        // GET: /Album/

        public ActionResult Index()
        {
            return View();
        }




        [HttpPost]
        // for insert 
        public JsonResult Album_insert(tblAlbum Album)
        {
            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();

            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {
                    //check username available
                    //var user = dc.tblUserRegistrations.FirstOrDefault();

                    var user = dc.tblAlbums.Where(a => a.Name.Equals(Album.Name)).FirstOrDefault();

                    if (user != null)
                    {
                        message = "Already Album Created with this Name";

                    }
                    else
                    {
                        if (Album != null)
                        {


                            //u.Created_By =  Request.ServerVariables["REMOTE_ADDR"];
                            //u.Created_By = Request.ServerVariables["REMOTE_HOST"];
                            //u.Created_By = Request.ServerVariables["REMOTE_USER"];

                            Album.URL = ConfigurationManager.AppSettings["AlbumUrl"].ToString();
                            Album.TemplateImage = Album.URL + "\\blank-picture.png";
                            Album.Created_By = Request.UserHostName;
                            Album.Created_date = DateTime.Now;
                            Album.YSNActive = true;

                            dc.tblAlbums.Add(Album);


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
                            message = "Album Creatation Failed!";
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

        //Update
        public JsonResult Album_update(tblAlbum Album)
        {
            string message = "";



            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();


            //if (ModelState.IsValid)
            //{
                using (Entities dc = new Entities())
                {
                    
                    if (Album != null)
                    {

                        var AlbumSelected = dc.tblAlbums.Where(x => x.ID == Album.ID).FirstOrDefault();


                        AlbumSelected.Name = Album.Name;
                        AlbumSelected.Description = Album.Description;
                        AlbumSelected.SnapDate = Album.SnapDate;
                        AlbumSelected.URL = Album.URL;
                        AlbumSelected.TemplateImage = Album.TemplateImage;

                        AlbumSelected.Updated_by = Request.UserHostName;
                        AlbumSelected.Updated_date = DateTime.Now;
                        dc.SaveChanges();
                        message = "Success";
                    }
                    else
                    {
                        message = "Album not available!";
                    }
                }
            //}
            //else
            //{
            //    message = "Failed!";
            //}
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        // Image Delete
        public JsonResult DeleteImage(tblAlbum Album)
        {
            if (System.IO.File.Exists(Album.TemplateImage))
            {
                System.IO.File.Delete(Album.TemplateImage);
            }

            return new JsonResult { Data = "Deleted Successfully", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Fetch GetAllAlbumDetail
        public JsonResult GetAllAlbumDetail(string AlbumGroup)
        {
            List<tblAlbum> AllAlbumDetail = new List<tblAlbum>();

            using (Entities dc = new Entities())
            {
                AllAlbumDetail = dc.tblAlbums.Where(a => a.YSNActive == true).ToList();

            }

            return new JsonResult { Data = AllAlbumDetail, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        // Fetch GetAlbumDetailByGroup
        public JsonResult GetAlbumDetailByGroup(string GroupID)
        {
            List<tblAlbum> AlbumDetails = new List<tblAlbum>();


            using (Entities dc = new Entities())
            {
                //AllAlbumDetail = dc.tblAlbum.Where(a => a.YSNActive == true).ToList();
                //var list = AllAlbumDetail.Find(x => x.ID.ToString().Contains(AlbumID));

                AlbumDetails = dc.Database.SqlQuery<tblAlbum>("exec prc_GetAlbumByGroupID  {0}", GroupID).ToList();

   
            }

            return new JsonResult { Data = AlbumDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }



        // Fetch AlbumDetail
        public JsonResult GetAlbumDetail(string AlbumGroup, string AfterDate, string NameSearch)
        {


            List<tblAlbum> AlbumDetails = new List<tblAlbum>();

            if (AfterDate == null)
            {
                AfterDate = DateTime.Now.ToString("dd-MMM-yyyy");
            }
            else
            {
                AfterDate = DateTime.Parse(AfterDate).ToString("dd-MMM-yyyy");

            }

            using (Entities dc = new Entities())
            {
                //AlbumDetails = dc.tblAlbum.Where(a => a.YSNActive == true).ToList();               

                AlbumDetails = dc.Database.SqlQuery<tblAlbum>("exec prc_GetAlbum  {0},{1},{2}", AlbumGroup, AfterDate, NameSearch).ToList();

            }


            return new JsonResult { Data = AlbumDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }



        // Fetch GetAlbumURL
        public JsonResult GetAlbumURL(string GroupID)
        {

            string URL = ConfigurationManager.AppSettings["ServerUrl"].ToString();

            URL = URL + "Home/AlbumPublish?Group_ID=" + Server.UrlEncode(Utilities.Encrypt(GroupID));

            return new JsonResult { Data = URL, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }



        // Fetch GetAlbumImages
        public JsonResult GetAlbumImages(string album_ID, string album_URL)
        {

            //var path = Server.MapPath(@"E:\album\102");

            var path = album_URL + @"\" + album_ID;
            //".jpg|.jpeg|.png|.gif|.tiff|.bmp"

            if (!Directory.Exists(path))
            {
                return new JsonResult { Data = "No Image In this Album", JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

            string supportedExtensions = "*.jpg,*.gif,*.png,*.bmp,*.jpe,*.jpeg,*.wmf,*.emf,*.xbm,*.ico,*.eps,*.tif,*.tiff,*.g01,*.g02,*.g03,*.g04,*.g05,*.g06,*.g07,*.g08";

            var images = System.IO.Directory.GetFiles(path, "*.*", SearchOption.AllDirectories).Where(s => supportedExtensions.Contains(Path.GetExtension(s).ToLower()));
          //  var images = System.IO.Directory.GetFiles(path, "*.jpg");
            
            System.Collections.Generic.List<string> image_urls = new System.Collections.Generic.List<string>();

            foreach (var image in images)
            {
                //image_urls.Add(string.Format("http://{0}/{1}", Request.Url.Authority, image));
                image_urls.Add(string.Format("{0}", image));
            }


            return new JsonResult { Data = image_urls, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }

        //


        public JsonResult FileUpload(tblAlbum album)
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

                    string path = album.URL + @"\" + album.ID ;

                   
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    path = path + @"\" + file.FileName;

                    // file is uploaded
                    //file.SaveAs(path);


                    //Image imgOriginal = Image.FromFile(path);

                    Image imgOriginal = Image.FromStream(file.InputStream, true, true);
                    imgOriginal.Save(path);

                    ////pass in whatever value you want
                    //Image imgActual = Utilities.Scale(imgOriginal, 256, 256);
                    //imgOriginal.Dispose();

                    //imgActual.Save(path);
                    //imgActual.Dispose();


                    

                    message = "Uploaded Successfully";
                }



            }


            catch (Exception ex)
            {
                message = ex.ToString();
            }

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }


        

        // Fetch GetAlbumGroupDetail
        public JsonResult GetAlbumGroupDetail(string AlbumGroup)
        {
            List<tblAlbumGroup> AlbumGroupDetails = new List<tblAlbumGroup>();
                
            using (Entities dc = new Entities())
            {
                AlbumGroupDetails = dc.tblAlbumGroups.Where(a => a.YSNActive == true).ToList(); 
                
            }

           return new JsonResult { Data = AlbumGroupDetails, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


        }


        //Album_Group_insert
        public JsonResult Album_Group_insert(tblAlbumGroup AlbumGroup)
        {
            string message = "";

            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();

            if (ModelState.IsValid)
            {
                using (Entities dc = new Entities())
                {
                    //check username available
                    //var user = dc.tblUserRegistrations.FirstOrDefault();

                    var user = dc.tblAlbumGroups.Where(a => a.GroupName.Equals(AlbumGroup.GroupName)).FirstOrDefault();

                    if (user != null)
                    {
                        message = "Already Album Group Created with this Name";

                    }
                    else
                    {
                        if (AlbumGroup != null)
                        {


                            AlbumGroup.Created_By = Request.UserHostName;
                            AlbumGroup.Created_date = DateTime.Now;
                            AlbumGroup.YSNActive = true;

                            dc.tblAlbumGroups.Add(AlbumGroup);


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
                            message = "Album Creatation Failed!";
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

        // //Album_Group_Update
        public JsonResult Album_Group_update(tblAlbumGroup AlbumGroup)
        {
            string message = "";



            var errors = ModelState.Where(x => x.Value.Errors.Count > 0).Select(x => new { x.Key, x.Value.Errors }).ToArray();


            //if (ModelState.IsValid)
            //{
            using (Entities dc = new Entities())
            {

                if (AlbumGroup != null)
                {

                    var AlbumSelected = dc.tblAlbumGroups.Where(x => x.ID == AlbumGroup.ID).FirstOrDefault();


                    AlbumSelected.GroupName = AlbumGroup.GroupName;
                    AlbumSelected.AlbumID = AlbumGroup.AlbumID;
                    AlbumSelected.SecurityCode = AlbumGroup.SecurityCode;

                    AlbumSelected.Updated_by = Request.UserHostName;
                    AlbumSelected.Updated_date = DateTime.Now;
                    dc.SaveChanges();
                    message = "Success";
                }
                else
                {
                    message = "Album Group not available!";
                }
            }
            //}
            //else
            //{
            //    message = "Failed!";
            //}
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


       

    }
}
