using Newtonsoft.Json;
using PacificPortal.Controllers;
using PacificPortal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Timers;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
 

namespace PacificPortal
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {

        System.Timers.Timer BirthdayTimer = new System.Timers.Timer();


        public void Init(HttpApplication context)
        {
            context.BeginRequest += (Application_BeginRequest);
        }

        private void Application_BeginRequest(object source, EventArgs e)
        {
         

            try
            {
                // Code that runs on application startup

                // Set the Interval to 1 seconds (1000 milliseconds).
                // Set the Interval to 1 minute (60000 milliseconds).
                //myTimer.Interval = 60000;

                //string strHostName = System.Net.Dns.GetHostName();
                //string clientIPAddress = System.Net.Dns.GetHostAddresses(strHostName).GetValue(0).ToString();
                //string clientip = clientIPAddress.ToString();

                string HostName = Dns.GetHostName();
                IPAddress[] ipaddress = Dns.GetHostAddresses(HostName);

                string clientIP = "";

                foreach (IPAddress ip4 in ipaddress.Where(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork))
                {
                    clientIP = ip4.ToString();
                }

                // clientIP = System.Web.HttpContext.Current.Request.UserHostAddress;


                var context = ((HttpApplication)source).Context;
                clientIP = context.Request.UserHostAddress;


                if (clientIP == "172.16.220.22")
                {
                    BirthdayTimer.Interval = 1000;
                    BirthdayTimer.AutoReset = true;
                    BirthdayTimer.Elapsed += new ElapsedEventHandler(myTimer_Elapsed);
                    BirthdayTimer.Enabled = true;
                }



            }
            catch
            {

            }

        }

        protected void Application_Start()
        {
            
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

         
           

        }
        public void myTimer_Elapsed(object source, System.Timers.ElapsedEventArgs e)
        {
            BirthdayTimer.Interval = 1000 * 60 * 60; // second * min * hour

            //Utilities.SendReport();
           
            //if (DateTime.Now.Hour == DateTime.Today.Hour && DateTime.Now.Minute == DateTime.Today.Minute)
            if (DateTime.Now.Hour == 0)
                {
                    Send_BirthDay_Mail();
                    BirthdayTimer.Interval = 1000 * 60 * 60;

                }
            
        }

       


        // inside your class
        public void Send_BirthDay_Mail()
        {


            DataController DataController_ = new DataController();



            JsonResult UserReg = DataController_.GetEmployeeBirthDay();
            var jsonUserReg = JsonConvert.SerializeObject(UserReg.Data);
            List<prc_EmployeeInfoDetail_Result> UserRegDetail = JsonConvert.DeserializeObject<List<prc_EmployeeInfoDetail_Result>>(jsonUserReg);


            for (var i = 0; i < UserRegDetail.Count; i++)
            {


                //// Write your send mail code here.

                EmailModel model = new EmailModel();

                //model.To = UserRegDetail[i].EmailID;

                model.To = "linkonb@pacificjeans.com";


                model.Subject = "Happy Birthday to " + UserRegDetail[i].Name ;



                model.Body = @"<table>
                                                    <tr>
                                                          
                                                <img id=""1"" src=""cid:bd_7.gif"">
                
                                                    </tr>
                                                    
                                            </table>";


                Utilities.SendMail(model, "Birthday").Data.ToString();
            }
        }



    }
}