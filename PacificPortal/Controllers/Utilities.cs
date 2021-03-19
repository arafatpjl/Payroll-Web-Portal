using PacificPortal.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared; 


namespace PacificPortal.Controllers
{
    public class Utilities : Controller
    {

        //
        //        smtp.Host = "mail.pacificjeans.com";
        //smtp.Port = 25;
        //model.Email = linkonb@pacificjeans.com
        //model.Password = sbu@#l

        public static JsonResult SendMail(EmailModel model,string Type)
        {
            string message = "Failed";


            try
            {


                model.Email = "HRIS@pacificjeans.com";
                model.Password = "ssp@#h";
                
                //model.Email = "linkonb@pacificjeans.com";
                //model.Password = "sbu@#l";

                MailAddress from = new MailAddress("HRIS@pacificjeans.com", "HRIS");

                if (model.FromEmail != null)
                {
                    from = new MailAddress(model.FromEmail, model.FromName);
                }

                MailAddress To = new MailAddress(model.To, "");


                using (MailMessage mm = new MailMessage(from, To))
                {

                    mm.Subject = model.Subject;
                    mm.Body = model.Body;
                    mm.IsBodyHtml = true;

                    if (Type == "Birthday")
                    {
                        string fileName = System.Web.Hosting.HostingEnvironment.MapPath(@"~/images/bd_7.gif");
                        // Create file attachment
                        Attachment ImageAttachment = new Attachment(fileName);
                        // Set the ContentId of the attachment, used in body HTML
                        ImageAttachment.ContentId = "bd_7.gif";

                        // Add an image as file attachment
                        mm.Attachments.Add(ImageAttachment);
                    }
                    else
                    {
                        string fileName = System.Web.Hosting.HostingEnvironment.MapPath(@"~/images/pjl_HRIS.png");
                        // Create file attachment
                        Attachment ImageAttachment = new Attachment(fileName);
                        // Set the ContentId of the attachment, used in body HTML
                        ImageAttachment.ContentId = "pjl_HRIS.png";

                        // Add an image as file attachment
                        mm.Attachments.Add(ImageAttachment);
                    }

                   
                   

                    mm.IsBodyHtml = true;
                   
                   
                    using (SmtpClient smtp = new SmtpClient())
                    {
                        //smtp.Host = "mail.pacificjeans.com";
                        smtp.Host = "172.16.48.7";
                        smtp.EnableSsl = false;

                        NetworkCredential NetworkCred = new NetworkCredential(model.Email, model.Password);
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = 25;
                        smtp.Send(mm);
                        message = "Success";
                    }
                }

            }
            catch(Exception ex)
            {
                message = ex.ToString();
            }
            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }



        public static void SendReport()
        {
            //List<Customer> model = new List<Customer>();
            //model.Add(new Customer { CompanyName = "Blah Inc.", ContactName = "Joe Blogs" });

            ReportDocument reportDocument = new ReportDocument();
            string reportPath = System.Web.Hosting.HostingEnvironment.MapPath("~/CrystalReport/PIB_DailyWithSummary_desWise_WithEff.rpt");

            reportDocument.Load(reportPath);
            //reportDocument.SetDataSource(model);
            using (var stream = reportDocument.ExportToStream(ExportFormatType.PortableDocFormat))
            {
                SmtpClient smtp = new SmtpClient
                {   
                    Port = 25,
                    UseDefaultCredentials = true,
                    Host = "mail.pacificjeans.com",
                    EnableSsl = true
                };

                smtp.EnableSsl = false;
                smtp.UseDefaultCredentials = true;
                smtp.Credentials = new NetworkCredential("HRIS@pacificjeans.com", "ssp@#h");

                //var message = new System.Net.Mail.MailMessage("linkonb@pacificjeans.com", "linkonb@pacificjeans.com", "subject", "body");

                var mailMessage = new MailMessage();
                mailMessage.To.Add(FormatMultipleEmailAddresses("test@gmail.com;john@rediff.com,prashant@mail.com"));

                var message = new System.Net.Mail.MailMessage("linkonb@pacificjeans.com", "linkonb@pacificjeans.com", "subject", "body");
               
                
                message.Attachments.Add(new Attachment(stream, "report.pdf"));

                smtp.Send(message);
            }
        }

        public static string FormatMultipleEmailAddresses(string emailAddresses)
        {
            var delimiters = new[] { ',', ';' };

            var addresses = emailAddresses.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);

            return string.Join(",", addresses);
        }

        // for GetRandomString
        public static string GetRandomString(int length, IEnumerable<char> characterSet)
        {
            if (length < 0)
                throw new ArgumentException("length must not be negative", "length");
            if (length > int.MaxValue / 8) // 250 million chars ought to be enough for anybody
                throw new ArgumentException("length is too big", "length");
            if (characterSet == null)
                throw new ArgumentNullException("characterSet");
            var characterArray = characterSet.Distinct().ToArray();
            if (characterArray.Length == 0)
                throw new ArgumentException("characterSet must not be empty", "characterSet");

            var bytes = new byte[length * 8];
            new RNGCryptoServiceProvider().GetBytes(bytes);
            var result = new char[length];
            for (int i = 0; i < length; i++)
            {
                ulong value = BitConverter.ToUInt64(bytes, i * 8);
                result[i] = characterArray[value % (uint)characterArray.Length];
            }
            return new string(result);
        }


        // for encrypt decrypt
        public static string Encrypt(string clearText)
        {
            string EncryptionKey = "deptsoft2017";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }

        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "deptsoft2017";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }

        public static Image Scale(Image imgPhoto, float Width, float Height)
        {
            float sourceWidth = imgPhoto.Width;
            float sourceHeight = imgPhoto.Height;
            float destHeight = 0;
            float destWidth = 0;
            int sourceX = 0;
            int sourceY = 0;
            int destX = 0;
            int destY = 0;

            // force resize, might distort image
            if (Width != 0 && Height != 0)
            {
                destWidth = Width;
                destHeight = Height;
            }
            // change size proportially depending on width or height
            else if (Height != 0)
            {
                destWidth = (float)(Height * sourceWidth) / sourceHeight;
                destHeight = Height;
            }
            else
            {
                destWidth = Width;
                destHeight = (float)(sourceHeight * Width / sourceWidth);
            }

            Bitmap bmPhoto = new Bitmap((int)destWidth, (int)destHeight,
                                        PixelFormat.Format32bppPArgb);
            bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

            Graphics grPhoto = Graphics.FromImage(bmPhoto);
            grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;

            grPhoto.DrawImage(imgPhoto,
                new Rectangle(destX, destY, (int)destWidth, (int)destHeight),
                new Rectangle(sourceX, sourceY, (int)sourceWidth, (int)sourceHeight),
                GraphicsUnit.Pixel);

            grPhoto.Dispose();

            return bmPhoto;
        }


        public static string ToTitleCase(string str)
        {
            string result = str;
            if (!string.IsNullOrEmpty(str))
            {
                var words = str.Split(' ');
                for (int index = 0; index < words.Length; index++)
                {
                    var s = words[index];
                    if (s.Length > 0)
                    {
                        words[index] = s[0].ToString().ToUpper() + s.Substring(1);
                    }
                }
                result = string.Join(" ", words);
            }
            return result;
        }


    }
}
