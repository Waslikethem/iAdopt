using System.Collections.Generic;

namespace DALProj
{
    public class Pets
    {
        public int PetID { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public int RaceCode { get; set; }
        public bool IsDog { get; set; }
        public int UserCode { get; set; }
        public char Gender { get; set; }
        public string Vaccines { get; set; }
        public string Image { get; set; }
        public string DueDate { get; set; }
        public int RegionID { get; set; }
        public List<string> Gallery { get; set; }
    }
}