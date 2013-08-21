<?php
namespace Design\DesignBundle\Services\PdfExterno3;
class PhpGenPdfFooter extends PhpGenPdfSections{
    protected $footerHeigh  = 0;
    //public function phpGenPdfFooter(stdClass $footer){
    //public function phpGenPdfFooter( $footer){
    function __construct( $footer){
        //----------------------------------------------------------------------
        $this->pdfSec       = $footer;
        $this->footerHeigh  = 0;
        //----------------------------------------------------------------------
        foreach ($this->pdfSec->Items as $k =>$v){
            $this->footerHeigh += $v->Height;
        }
        //----------------------------------------------------------------------
        $this->initialize();
        //----------------------------------------------------------------------
    }
    public function write(PhpGenPdf $phpGen){
        //----------------------------------------------------------------------
        $pdf 			= $phpGen->getPdf();
        //$left			= $pdf->lMargin;
        $marg = $pdf->getMargins();
        $left = $marg["left"];        
        
        $top                    = $pdf->getPageBreakTrigger();
        //----------------------------------------------------------------------
        $pdf->SetY($pdf->getH() - ( $phpGen->getMarginBottom() + $this->footerHeigh)) ;
        $top                    = $pdf->GetY();
        //----------------------------------------------------------------------
        while ($this->nextSection()) {
            //------------------------------------------------------------------
            while ($obj = $this->next()) {
                //--------------------------------------------------------------
                $h          = $phpGen->pdfPrintObject($obj, $top, $left);
                //--------------------------------------------------------------
            }
            //------------------------------------------------------------------
            $top = $pdf->GetY();
            //------------------------------------------------------------------
        }
        //----------------------------------------------------------------------
    }
    public function writeFooterGrupo(PhpGenPdf $phpGen){
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $this->_write($phpGen);
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
    }
}