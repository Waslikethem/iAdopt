using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALProj
{
    public class Pet
    {
        public int PetID { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public int RaceCode { get; set; }
        public bool IsDog { get; set; }
        public int UserCode { get; set; }
        public char Gender { get; set; }
        public string Vaccines { get; set; }
        public List<string> Gallery { get; set; }
    }
}
