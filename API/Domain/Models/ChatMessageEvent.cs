using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ChatMessageEvent
    {
        public string User { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public MessageEventType MessageEventType { get; set; }
    }
}
