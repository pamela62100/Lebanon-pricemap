using MailKit.Net.Smtp;
using MimeKit;

namespace LebanonPriceMap.Server.Services;

public class EmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<bool> SendAsync(string toEmail, string subject, string htmlBody)
    {
        var host = _config["Smtp:Host"];
        var portStr = _config["Smtp:Port"];
        var user = _config["Smtp:User"];
        var pass = _config["Smtp:Password"];
        var from = _config["Smtp:From"] ?? user;

        if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass))
        {
            // Dev mode — no SMTP configured. Log instead of sending.
            _logger.LogWarning("SMTP not configured. Would have sent email to {Email}: {Subject}\n{Body}",
                toEmail, subject, htmlBody);
            return false;
        }

        try
        {
            var msg = new MimeMessage();
            msg.From.Add(MailboxAddress.Parse(from));
            msg.To.Add(MailboxAddress.Parse(toEmail));
            msg.Subject = subject;
            msg.Body = new TextPart("html") { Text = htmlBody };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(host, int.Parse(portStr ?? "587"), MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(user, pass);
            await smtp.SendAsync(msg);
            await smtp.DisconnectAsync(true);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            return false;
        }
    }
}
